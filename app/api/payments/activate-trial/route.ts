import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        // Secure backend check: Verify the user is authenticated
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || user.id !== userId) {
            console.error("Auth mismatch or not logged in:", { user: user?.id, requested: userId });
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        if (!supabaseAdmin) {
            console.error("Supabase Admin key missing in environment");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // Activate 30-day trial logic
        console.log(`Activating trial for user: ${userId}`);
        const joinDate = new Date().toISOString();
        const { error } = await supabaseAdmin.from('user_profiles').update({
            join_date: joinDate,
            plan: 'Free',
            subscription_status: 'trialing'
        }).eq('user_id', userId);

        if (error) {
            console.error("Supabase Update Error:", error);
            throw error;
        }

        return NextResponse.json({ success: true, joinDate });
    } catch (error: any) {
        console.error("Trial Activation Fatal Error:", error);
        return NextResponse.json({ error: error.message || "Failed to activate trial" }, { status: 500 });
    }
}
