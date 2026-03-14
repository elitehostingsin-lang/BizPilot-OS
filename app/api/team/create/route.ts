import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { email, full_name, role, business_owner_id, phone } = await req.json();

        if (!email || !full_name || !business_owner_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create Auth User via Admin API
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: 'TemporaryPass123!', // User should reset this
            email_confirm: true,
            user_metadata: { full_name, role }
        });

        if (authError) throw authError;

        // 2. Create Profile for Team Member
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: authUser.user.id,
                email,
                full_name,
                role: 'business', // Default role for team members in profiles
            });

        if (profileError) throw profileError;

        // 3. Create Team Member Record
        const { data: teamMember, error: teamError } = await supabaseAdmin
            .from('team_members')
            .insert({
                business_owner_id,
                user_id: authUser.user.id,
                full_name,
                email,
                phone,
                role: role || 'telecaller'
            })
            .select()
            .single();

        if (teamError) throw teamError;

        return NextResponse.json({ success: true, teamMember }, { status: 201 });
    } catch (error: any) {
        console.error('❌ TEAM_CREATION_ERROR:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
