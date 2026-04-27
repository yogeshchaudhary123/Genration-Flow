import { NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import { PaymentService } from "@/services/payment.service";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    logger.error("Stripe webhook secret is not configured.");
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }

  if (!signature) {
    logger.error("No Stripe signature found in webhook request.");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    logger.error(`Stripe Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;
      const transactionId = paymentIntent.id;

      logger.info(`Stripe PaymentIntent ${transactionId} succeeded. Verifying...`);
      await PaymentService.verifyStripePayment(transactionId);
    } else if (event.type === "payment_intent.payment_failed") {
      logger.warn(`Stripe PaymentIntent failed: ${event.data.object.id}`);
      // Handle failure logic if necessary
    } else {
      logger.info(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    logger.error(`Error processing Stripe webhook: ${error.message}`);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
