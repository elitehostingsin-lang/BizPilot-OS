import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, userId } = body;

        console.log("Checkout Request Initiated:", { email, userId });

        if (!email || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Secure backend check: Verify session matches userId
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || user.id !== userId) {
            console.error("Auth mismatch or not logged in for checkout:", { user: user?.id, requested: userId });
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        let apiKey = process.env.DODO_PAYMENTS_API_KEY;

        // DEBUG: Fallback to the key you provided if env var is missing
        if (!apiKey || apiKey.trim() === "") {
            console.warn("Env Var DODO_PAYMENTS_API_KEY is missing. Using fallback key.");
            apiKey = "9_HZfeHUQeDm583D.amqBlR4yaF0yFlQdu-OLXNHghgEvPYshGT85Jm_cbEB35AFB";
        }

        const productId = process.env.DODO_PRODUCT_ID || "p_123";

        // Construct payload
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
            metadata: {
                userId: userId
            }
        };

        console.log("Using API Key (Prefix):", apiKey.substring(0, 5) + "...");
        console.log("Sending Payload to Dodo:", JSON.stringify(payload, null, 2));

        // Try LIVE endpoint first (Key format suggests live/production)
        const response = await fetch('https://live.dodopayments.com/payments/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        console.log(`Dodo API Status: ${response.status} ${response.statusText}`);

        // READ TEXT
        const responseText = await response.text();
        console.log("Raw Dodo Response Body:", responseText || "(Empty String)");

        if (!responseText && !response.ok) {
            throw new Error(`Dodo API Failed with Status ${response.status} (${response.statusText}) and empty body.`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse Dodo response as JSON:", responseText);
            throw new Error(`Invalid JSON response from Dodo: ${responseText.substring(0, 100)}...`);
        }

        if (!response.ok) {
            console.error("Dodo API Error Response:", data);
            throw new Error(data.message || data.error || JSON.stringify(data));
        }

        // Handle various response formats
        const checkoutUrl = data.checkout_url || data.url || data.payment_url;

        if (!checkoutUrl) {
            console.error("No checkout URL in data:", data);
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
