import { stripe } from "@/lib/payments/stripe";
import { razorpay } from "@/lib/payments/razorpay";
import prisma from "@/lib/db/prisma";
import crypto from "crypto";
import { logger } from "@/lib/logger";

export class PaymentService {
  static async createStripeCheckoutSession(orderId: string, amount: number, successUrl: string, cancelUrl: string, idempotencyKey?: string) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { orderId },
    }, idempotencyKey ? { idempotencyKey } : undefined);

    await prisma.payment.create({
      data: {
        orderId,
        amount,
        method: "STRIPE",
        transactionId: session.id,
        status: "PENDING",
      },
    });

    return session;
  }

  static async createRazorpayOrder(orderId: string, amount: number) {
    // Razorpay works via an Order + frontend modal, NOT a redirect like Stripe.
    // amount is in USD; convert to INR paisa (1 USD ≈ 83 INR, adjust as needed).
    const amountInPaisa = Math.round(amount * 83 * 100);

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaisa,
      currency: "INR",
      receipt: orderId,
      notes: { orderId },
    });

    await prisma.payment.create({
      data: {
        orderId,
        amount,
        method: "RAZORPAY",
        transactionId: rzpOrder.id,
        status: "PENDING",
      },
    });

    return rzpOrder;
  }

  static async verifyStripePayment(transactionId: string, orderId?: string) {
    let payment;

    // 1. Try finding by orderId if provided (most reliable)
    if (orderId) {
      payment = await prisma.payment.findUnique({
        where: { orderId },
      });
    }

    // 2. If not found by orderId, try transactionId
    if (!payment) {
      payment = await prisma.payment.findUnique({
        where: { transactionId },
      });
    }

    if (!payment) {
      logger.error(`Payment not found for orderId: ${orderId}, transactionId: ${transactionId}`);
      throw new Error("Payment record not found");
    }

    // If it's already completed, just return true
    if (payment.status === "COMPLETED") return true;

    // Double check with Stripe for security
    if (transactionId.startsWith("cs_")) {
      const session = await stripe.checkout.sessions.retrieve(transactionId);
      if (session.payment_status !== "paid") return false;
    } else {
      const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
      if (paymentIntent.status !== "succeeded") return false;
    }

    // Update payment and order status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        transactionId: transactionId, // Store the latest identifier (e.g. pi_...)
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });

    return true;
  }

  static async verifyRazorpayPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string
  ) {
    const secret = process.env.RAZORPAY_SECRET;

    if (!secret) {
      throw new Error("Razorpay secret not configured");
    }

    // Razorpay signature = HMAC-SHA256 of "razorpay_order_id|razorpay_payment_id"
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== signature) {
      throw new Error("Invalid payment signature");
    }

    // transactionId stores the razorpay order id (set during createRazorpayOrder)
    const payment = await prisma.payment.update({
      where: { transactionId: razorpayOrderId },
      data: {
        paymentId: razorpayPaymentId,
        signature,
        status: "COMPLETED",
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });

    return true;
  }
}
