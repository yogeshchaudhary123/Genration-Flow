import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PaymentService } from "@/services/payment.service";
import { logger } from "@/lib/logger";
import { z } from "zod";

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string(), // our internal DB order id
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      verifySchema.parse(body);

    await PaymentService.verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    logger.info(`Razorpay payment verified for order ${orderId}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error("Razorpay verification error:", error.message);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 400 }
    );
  }
}
