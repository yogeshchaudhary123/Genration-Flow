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
  const { success } = rateLimit(ip, 5, 60000, "checkout"); // Max 5 checkouts per minute

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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/orders?success=true`;
    const cancelUrl = `${baseUrl}/cart?canceled=true`;

    if (paymentMethod === "STRIPE") {
      const session = await PaymentService.createStripeCheckoutSession(order.id, order.totalAmount, successUrl, cancelUrl, idempotencyKey);
      paymentData = { url: session.url, type: "STRIPE" };
      logger.info(`Stripe checkout session created for order ${order.id}`);
    } else {
      // Razorpay uses a modal on the frontend — we create an Order server-side
      // and return the details so the frontend SDK can open the checkout popup.
      const rzpOrder = await PaymentService.createRazorpayOrder(order.id, order.totalAmount);
      paymentData = {
        type: "RAZORPAY",
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,          // in paisa
        currency: rzpOrder.currency,
        key: process.env.RAZORPAY_KEY,
        orderId: order.id,                // our DB order id for verification
        successUrl,
      };
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
