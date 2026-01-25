import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { email, userId } = await req.json();

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

        const apiKey = process.env.DODO_PAYMENTS_API_KEY;
        const productId = process.env.DODO_PRODUCT_ID || "p_123";

        // Manual fetch to control exact JSON structure
        const response = await fetch('https://live.dodopayments.com/payments/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
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
            })
        });

        const data = await response.json();

        console.log("Dodo API Response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(data.message || JSON.stringify(data));
        }

        // Handle various response formats
        const checkoutUrl = data.checkout_url || data.url || data.payment_url;

        if (!checkoutUrl) {
            throw new Error("No checkout URL in response");
        }

        return NextResponse.json({ url: checkoutUrl });

    } catch (error: any) {
        console.error("Dodo Checkout Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to create checkout session"
        }, { status: 500 });
    }
}
