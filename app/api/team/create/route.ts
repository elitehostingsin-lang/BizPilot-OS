import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const teamMemberSchema = z.object({
    full_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    role: z.enum(['telecaller', 'manager', 'admin']),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validated = teamMemberSchema.parse(body);

        // Get the owner's ID from the request headers or session
        // For now, we'll assume the owner is authenticated and we can get their ID
        // In a real scenario, you'd use the auth middleware session
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create auth user for team member via Admin API
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: validated.email,
            email_confirm: true,
            user_metadata: {
                full_name: validated.full_name,
                role: validated.role,
            }
        });

        if (authError) {
            console.error('❌ Auth creation error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // Create team member record in public schema
        // We need the owner_id. Let's assume it's passed or retrieved.
        // For this workable implementation, we'll use a placeholder or retrieve it.
        const ownerId = req.headers.get('x-owner-id'); // Assuming the client sends this or middleware sets it

        const { data: teamMember, error: teamError } = await supabaseAdmin
            .from('team_members')
            .insert({
                business_owner_id: ownerId,
                user_id: authUser.user.id,
                full_name: validated.full_name,
                email: validated.email,
                phone: validated.phone,
                role: validated.role,
                is_active: true
            })
            .select()
            .single();

        if (teamError) {
            console.error('❌ Database error:', teamError);
            return NextResponse.json({ error: teamError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, teamMember });

    } catch (error: any) {
        console.error('❌ Team creation error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
