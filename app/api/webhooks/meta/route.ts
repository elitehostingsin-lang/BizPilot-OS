import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET handler for Meta Webhook Verification
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
            console.log('✅ META_WEBHOOK: Verified successfully');
            return new NextResponse(challenge, { status: 200 });
        }
    }

    return new NextResponse('Verification failed', { status: 403 });
}

/**
 * POST handler for incoming Lead Data from Meta
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (body.object === 'page') {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    if (change.field === 'leadgen') {
                        const leadId = change.value.leadgen_id;
                        const pageId = change.value.page_id;
                        const formId = change.value.form_id;

                        console.log(`📥 META_WEBHOOK: Received lead ${leadId} from page ${pageId}`);

                        // 1. Fetch full lead details from Meta Graph API
                        const accessToken = process.env.META_ACCESS_TOKEN;
                        const response = await fetch(
                            `https://graph.facebook.com/v19.0/${leadId}?access_token=${accessToken}`
                        );

                        if (!response.ok) {
                            console.error('❌ META_API_ERROR:', await response.text());
                            continue;
                        }

                        const metaLead = await response.json();

                        // 2. Extract and Map Fields
                        const fieldData: any = {};
                        metaLead.field_data.forEach((field: any) => {
                            fieldData[field.name] = field.values[0];
                        });

                        // 3. Find Business Owner by Meta Page ID
                        const { data: profile, error: profileError } = await supabaseAdmin
                            .from('profiles')
                            .select('id')
                            .eq('meta_page_id', pageId)
                            .single();

                        if (profileError || !profile) {
                            console.error(`⚠️ PROFILE_NOT_FOUND: No owner found for Page ID ${pageId}`);
                            continue;
                        }

                        // 4. Insert Lead into CRM
                        const { data: newLead, error: leadError } = await supabaseAdmin
                            .from('leads')
                            .insert({
                                business_owner_id: profile.id,
                                meta_lead_id: leadId,
                                meta_form_id: formId,
                                full_name: fieldData.full_name || 'Meta Lead',
                                email: fieldData.email,
                                phone: fieldData.phone_number,
                                city: fieldData.city,
                                source: 'meta_ads',
                                status: 'new',
                                custom_fields: fieldData
                            })
                            .select()
                            .single();

                        if (leadError) {
                            console.error('❌ CRM_INSERT_ERROR:', leadError.message);
                            continue;
                        }

                        // 5. Create Activity Log
                        await supabaseAdmin.from('activities').insert({
                            business_owner_id: profile.id,
                            lead_id: newLead.id,
                            activity_type: 'note',
                            subject: 'Meta Lead Recieved',
                            description: `New lead captured via Meta Form: ${formId}`
                        });

                        console.log(`✅ CRM_SUCCESS: Lead ${newLead.id} processed`);
                    }
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: any) {
        console.error('❌ WEBHOOK_INTERNAL_ERROR:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
