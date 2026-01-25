import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const headers = req.headers;
    const signature = headers.get("webhook-signature");
    const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

    if (!signature || !secret) {
        return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    const wh = new Webhook(secret);
    try {
        wh.verify(payload, headers as any);
    } catch (err) {
        console.error("Webhook Verification Failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(payload);
    const eventType = event.type;
    console.log(`[Dodo Webhook] Received event: ${eventType}`);

    const data = event.data;
    const metadata = data.metadata || {};
    const userId = metadata.userId;

    if (!userId) {
        console.error("[Dodo Webhook] No userId found in metadata");
        return NextResponse.json({ received: true, info: "No userId" });
    }

    if (!supabaseAdmin) {
        console.error("[Dodo Webhook] Supabase Admin client not initialized. Check SUPABASE_SERVICE_ROLE_KEY.");
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    try {
        switch (eventType) {
            case "subscription.created":
            case "subscription.active":
            case "payment.succeeded":
                console.log(`[Dodo Webhook] Processing successful payment for user: ${userId}`);
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                const { error: updateError } = await supabaseAdmin.from('user_profiles').update({
                    plan: 'Pro Plan',
                    subscription_status: 'active',
                    payment_status: 'paid',
                    last_payment_date: new Date().toISOString(),
                    subscription_end_date: nextMonth.toISOString(),
                    last_transaction_id: data.payment_id || data.subscription_id
                }).eq('user_id', userId);

                if (updateError) throw updateError;
                console.log(`[Dodo Webhook] User ${userId} successfully upgraded to Pro.`);
                break;

            case "subscription.canceled":
            case "subscription.failed":
                console.log(`[Dodo Webhook] Processing cancellation for user: ${userId}`);
                await supabaseAdmin.from('user_profiles').update({
                    subscription_status: 'canceled',
                    plan: "Trial (Expired)"
                }).eq('user_id', userId);
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error(`[Dodo Webhook] Error processing ${eventType}:`, error.message);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
