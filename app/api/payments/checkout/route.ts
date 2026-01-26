import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = 'edge';

// Helper to get Product ID
async function getOrCreateProductId(): Promise<string> {
    const envProductId = process.env.DODO_PRODUCT_ID;
    if (envProductId && envProductId !== 'p_123') return envProductId;
    return "pdt_0NX2peu6HbEMqgfIxiTlo";
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, userId, planId } = body; // Accept planId

        console.log("Checkout Request Initiated:", { email, userId, planId });

        if (!email || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || user.id !== userId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        let apiKey = process.env.DODO_PAYMENTS_API_KEY;
        if (!apiKey || apiKey.trim() === "") {
            apiKey = "9_HZfeHUQeDm583D.amqBlR4yaF0yFlQdu-OLXNHghgEvPYshGT85Jm_cbEB35AFB";
        }

        // Plan Mapping
        const planMapping: Record<string, string> = {
            'basic': process.env.DODO_BASIC_PLAN_ID || "pdt_0NX2peu6HbEMqgfIxiTlo", // Fallback to provided ID
            'standard': "pdt_0NX2peu6HbEMqgfIxiTlo", // This is your verified ID
            'premium': process.env.DODO_PREMIUM_PLAN_ID || "pdt_0NX2peu6HbEMqgfIxiTlo"
        };

        const productId = planMapping[planId || 'standard'];
        console.log(`Using Plan: ${planId}, Product ID: ${productId}`);

        const payload = {
            product_cart: [
                {
                    product_id: productId,
                    quantity: 1
                }
            ],
            billing: {
                city: "New York",
                country: "US",
                state: "NY",
                street: "123 Business Rd",
                zip_code: "10001"
            },
            customer: {
                email: email,
                name: email.split('@')[0]
            },
            return_url: `${new URL(req.url).origin}/dashboard?payment=success`,
            metadata: { userId: userId }
        };

        const response = await fetch('https://live.dodopayments.com/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        console.log(`Dodo API Status: ${response.status} ${response.statusText}`);
        const responseText = await response.text();
        console.log("Raw Dodo Response Body:", responseText || "(Empty String)");

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Dodo API Error: ${response.status} ${response.statusText} - ${responseText}`);
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || JSON.stringify(data));
        }

        const checkoutUrl = data.checkout_url || data.url || data.payment_url;
        if (!checkoutUrl) {
            throw new Error("No checkout URL found in payment provider response");
        }

        return NextResponse.json({ url: checkoutUrl });

    } catch (error: any) {
        console.error("Checkout Fatal Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to create checkout session",
            details: error.toString()
        }, { status: 500 });
    }
}
