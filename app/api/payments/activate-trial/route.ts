import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // Activate 30-day trial
        const joinDate = new Date().toISOString();
        const { error } = await supabaseAdmin.from('user_profiles').update({
            join_date: joinDate,
            plan: 'Free',
            subscription_status: 'trialing'
        }).eq('user_id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true, joinDate });
    } catch (error: any) {
        console.error("Trial Activation Error:", error);
        return NextResponse.json({ error: error.message || "Failed to activate trial" }, { status: 500 });
    }
}
