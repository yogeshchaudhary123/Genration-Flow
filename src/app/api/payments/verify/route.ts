import { NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    await PaymentService.verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    logger.info(`Razorpay payment verified successfully for order: ${razorpay_order_id}`);
    
    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error: any) {
    logger.error("Razorpay verification failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
