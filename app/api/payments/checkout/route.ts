import { NextRequest, NextResponse } from "next/server";
import { DodoPayments } from "dodopayments";
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

        const dodo = new DodoPayments({
            apiKey: process.env.DODO_PAYMENTS_API_KEY || "",
        } as any);

        // Fixed: Removed product_cart field that was causing 422 error
        const payment = await (dodo.payments.create as any)({
            customer: {
                email: email,
                name: email.split('@')[0],
            },
            payment: {
                amount: 1000, // $10.00 in cents
                currency: "USD",
            },
            product_id: process.env.DODO_PRODUCT_ID || "prod_default",
            return_url: `${new URL(req.url).origin}/dashboard?payment=success`,
            metadata: {
                userId: userId,
            }
        });

        const checkoutUrl = (payment as any).checkout_url || (payment as any).url;

        if (!checkoutUrl) {
            console.error("No checkout URL in response:", payment);
            return NextResponse.json({ error: "Failed to get checkout URL" }, { status: 500 });
        }

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: any) {
        console.error("Dodo Checkout Error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        return NextResponse.json({
            error: error.message || "Failed to create checkout session",
            details: error.response?.data || "No additional details"
        }, { status: 500 });
    }
}
