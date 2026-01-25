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

        // Initialize Dodo Payments
        const dodo = new DodoPayments({
            bearerToken: process.env.DODO_PAYMENTS_API_KEY || "",
        } as any);

        // Minimal payment request - only required fields
        const paymentRequest = {
            customer: {
                email: email,
            },
            product_id: process.env.DODO_PRODUCT_ID || "",
            return_url: `${new URL(req.url).origin}/dashboard?payment=success`,
        };

        console.log("Creating payment with request:", JSON.stringify(paymentRequest, null, 2));

        const payment = await (dodo.payments.create as any)(paymentRequest);

        console.log("Payment response:", JSON.stringify(payment, null, 2));

        // Try multiple possible URL fields
        const checkoutUrl = (payment as any).checkout_url ||
            (payment as any).url ||
            (payment as any).payment_url ||
            (payment as any).hosted_url;

        if (!checkoutUrl) {
            console.error("No checkout URL found in payment response:", payment);
            return NextResponse.json({
                error: "Failed to get checkout URL",
                response: payment
            }, { status: 500 });
        }

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: any) {
        console.error("Dodo Checkout Error:", error);
        console.error("Error message:", error.message);
        console.error("Error response:", error.response?.data);

        return NextResponse.json({
            error: error.message || "Failed to create checkout session",
            details: error.response?.data || error.toString()
        }, { status: 500 });
    }
}
