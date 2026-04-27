import { stripe } from "@/lib/payments/stripe";
import { razorpay } from "@/lib/payments/razorpay";
import prisma from "@/lib/db/prisma";
import crypto from "crypto";

export class PaymentService {
  static async createStripePaymentIntent(orderId: string, amount: number, idempotencyKey?: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: "inr",
      metadata: { orderId },
    }, idempotencyKey ? { idempotencyKey } : undefined);

    await prisma.payment.create({
      data: {
        orderId,
        amount,
        method: "STRIPE",
        transactionId: paymentIntent.id,
        status: "PENDING",
      },
    });

    return paymentIntent;
  }

  static async createRazorpayOrder(orderId: string, amount: number) {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: orderId,
    });

    await prisma.payment.create({
      data: {
        orderId,
        amount,
        method: "RAZORPAY",
        transactionId: razorpayOrder.id,
        status: "PENDING",
      },
    });

    return razorpayOrder;
  }

  static async verifyStripePayment(transactionId: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    if (paymentIntent.status === "succeeded") {
      const payment = await prisma.payment.update({
        where: { transactionId },
        data: { status: "COMPLETED" },
      });

      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID" },
      });

      return true;
    }

    return false;
  }

  static async verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!secret) {
      throw new Error("Razorpay secret not configured");
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${orderId}|${paymentId}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== signature) {
      throw new Error("Invalid payment signature");
    }

    // Update payment record
    const payment = await prisma.payment.update({
      where: { transactionId: orderId },
      data: {
        paymentId,
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
