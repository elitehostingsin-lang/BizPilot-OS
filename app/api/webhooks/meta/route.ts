import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify webhook (Facebook sends GET request)
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
        console.log('✅ Webhook verified');
        return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// Receive leads (Facebook sends POST request)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('📥 Received webhook:', JSON.stringify(body, null, 2));

        // Facebook sends events in an entry array
        if (body.object === 'page' && body.entry) {
            for (const entry of body.entry) {
                if (entry.changes) {
                    for (const change of entry.changes) {
                        if (change.field === 'leadgen') {
                            // Process the lead
                            await processLead(change.value);
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

// Process individual lead
async function processLead(leadData: any) {
    try {
        const leadId = leadData.leadgen_id;
        const pageId = leadData.page_id;
        const formId = leadData.form_id;
        const adId = leadData.ad_id;

        console.log(`📋 Processing lead: ${leadId}`);

        // Fetch full lead data from Graph API
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${leadId}?access_token=${process.env.META_ACCESS_TOKEN}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch lead from Meta');
        }

        const lead = await response.json();

        // Extract field data
        const fieldData: Record<string, string> = {};
        if (lead.field_data) {
            for (const field of lead.field_data) {
                fieldData[field.name] = field.values[0];
            }
        }

        // Map common fields
        const fullName = fieldData['full_name'] || fieldData['first_name'] + ' ' + fieldData['last_name'] || 'Unknown';
        const email = fieldData['email'] || null;
        const phone = fieldData['phone_number'] || fieldData['phone'] || null;
        const company = fieldData['company_name'] || fieldData['company'] || null;
        const location = fieldData['city'] || fieldData['location'] || null;
        const budget = fieldData['budget'] || null;
        const message = fieldData['message'] || fieldData['question'] || null;

        // Find business owner by page_id
        // Note: This assumes page_id is stored in user_profiles or a linked table
        // For now, we'll try to find any profile with this meta_page_id if it exists
        const { data: profileData } = await supabase
            .from('user_profiles')
            .select('user_id')
            .eq('company', pageId) // This is a placeholder; would normally have a meta_page_id column
            .single();

        // If not found, we'll log it for now
        if (!profileData) {
            console.warn('⚠️ No user profile found matching page_id:', pageId);
            // For the workable demo, we'll skip or use a default if available
            return;
        }

        // Insert lead into database
        const { data: insertedLead, error } = await supabase
            .from('leads')
            .insert({
                user_id: profileData.user_id,
                meta_lead_id: leadId,
                meta_form_id: formId,
                meta_ad_id: adId,
                meta_page_id: pageId,
                full_name: fullName,
                email: email,
                phone: phone,
                company: company,
                location: location,
                budget: budget,
                message: message,
                custom_fields: fieldData,
                status: 'new',
                priority: 'medium',
                source: 'meta_ads'
            })
            .select()
            .single();

        if (error) {
            console.error('❌ Database insert error:', error);
            throw error;
        }

        console.log('✅ Lead saved to database:', insertedLead.id);

        // Activity log
        await supabase.from('lead_activities').insert({
            lead_id: insertedLead.id,
            user_id: profileData.user_id,
            activity_type: 'note',
            title: 'Meta Lead Captured',
            description: `Lead received via Meta Form ID: ${formId}`
        });

    } catch (error) {
        console.error('❌ Error processing lead:', error);
        throw error;
    }
}
