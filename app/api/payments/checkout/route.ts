import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = 'edge';

// Helper to auto-create product if missing
async function getOrCreateProductId(apiKey: string): Promise<string> {
    const envProductId = process.env.DODO_PRODUCT_ID;
    if (envProductId && envProductId !== 'p_123') return envProductId;

    console.log("No DODO_PRODUCT_ID found. Attempting to auto-create product...");

    try {
        const createRes = await fetch('https://live.dodopayments.com/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                name: "BizPilot Pro Subscription",
                description: "Monthly subscription for BizPilot OS Pro features",
                amount: 1000, // $10.00
                currency: "USD",
                payment_type: "recurring",
                interval: "month"
            })
        });

        const data = await createRes.json();
        console.log("Auto-create product response:", JSON.stringify(data, null, 2));

        if (data.product_id) return data.product_id;
        if (data.id) return data.id;

        throw new Error(`Failed to extract product ID. Response: ${JSON.stringify(data)}`);
    } catch (error: any) {
        console.error("Auto-creation failed detailed:", error);
        // DO NOT RETURN FAKE ID. Throw so we know why it failed.
        throw new Error(`Product Auto-Creation Failed: ${error.message || error}`);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, userId } = body;

        console.log("Checkout Request Initiated:", { email, userId });

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
            console.warn("Env Var DODO_PAYMENTS_API_KEY is missing. Using fallback key.");
            apiKey = "9_HZfeHUQeDm583D.amqBlR4yaF0yFlQdu-OLXNHghgEvPYshGT85Jm_cbEB35AFB";
        }

        // Dynamically get valid Product ID
        const productId = await getOrCreateProductId(apiKey);
        console.log("Using Product ID:", productId);

        const payload = {
            product_cart: [
                {
                    product_id: productId, // Now sending the required field
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
