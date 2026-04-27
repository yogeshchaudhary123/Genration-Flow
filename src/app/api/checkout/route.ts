import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderService } from "@/services/order.service";
import { PaymentService } from "@/services/payment.service";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { rateLimit, getIp } from "@/lib/rate-limit";
import crypto from "crypto";

const checkoutSchema = z.object({
  shippingAddress: z.string().min(10),
  paymentMethod: z.enum(["STRIPE", "RAZORPAY"]),
});

export async function POST(req: Request) {
  const ip = getIp(req);
  const { success } = rateLimit(ip, 5, 60000); // Max 5 checkouts per minute

  if (!success) {
    logger.warn(`Rate limit exceeded for checkout from IP: ${ip}`);
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized checkout attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { shippingAddress, paymentMethod } = checkoutSchema.parse(body);

    // 1. Create order
    const order = await OrderService.createOrder(session.user.id, shippingAddress);
    logger.info(`Created order ${order.id} for user ${session.user.id}`);

    const idempotencyKey = crypto.randomUUID();

    // 2. Initiate payment based on method
    let paymentData;
    if (paymentMethod === "STRIPE") {
      const intent = await PaymentService.createStripePaymentIntent(order.id, order.totalAmount, idempotencyKey);
      paymentData = { clientSecret: intent.client_secret, type: "STRIPE" };
      logger.info(`Stripe payment intent created for order ${order.id}`);
    } else {
      const razorOrder = await PaymentService.createRazorpayOrder(order.id, order.totalAmount);
      paymentData = { razorpayOrderId: razorOrder.id, type: "RAZORPAY" };
      logger.info(`Razorpay order created for order ${order.id}`);
    }

    return NextResponse.json({
      orderId: order.id,
      paymentData,
    });
  } catch (error: any) {
    logger.error("Checkout error:", error.message);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
