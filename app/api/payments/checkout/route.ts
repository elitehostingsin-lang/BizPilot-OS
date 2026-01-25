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

        const dodoSymbol = Symbol.for("dodo-client");
        const dodo = new DodoPayments({
            apiKey: process.env.DODO_PAYMENTS_API_KEY || "",
        } as any);

        const payment = await (dodo.payments.create as any)({
            billing: {
                city: "Unknown",
                country: "US",
                state: "Unknown",
                street: "Unknown",
                zip_code: "00000"
            },
            customer: {
                email: email,
                name: email.split('@')[0],
            },
            product_id: process.env.DODO_PRODUCT_ID || "p_123",
            quantity: 1,
            return_url: `${new URL(req.url).origin}/dashboard?payment=success`,
            metadata: {
                userId: userId,
            }
        });

        const checkoutUrl = (payment as any).checkout_url;
        return NextResponse.json({ url: checkoutUrl });
    } catch (error: any) {
        console.error("Dodo Checkout Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
    }
}
