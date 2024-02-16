import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { subscriptionCreated } from "@/lib/stripe/stripe-actions";

const stripeWebhookEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
  console.log("stipe webhook received request!");
  let stripeEvent: Stripe.Event;
  const body = await req.text();
  const sig = headers().get("Stripe-Signature");
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  try {
    if (!sig || !webhookSecret) {
      console.log(
        "🔴 Error Stripe webhook secret or the signature does not exist."
      );
      return;
    }
    stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: any) {
    console.log(`🔴 Error ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    console.log("received: ", stripeEvent.type);
    if (stripeWebhookEvents.has(stripeEvent.type)) {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      // TODO NOTE: in a local environment, all stripe webhook events come to one wehbook endpoint only
      // But in production, there are 2 endpoints. One for stripe events from the subscriptions.
      // And one endpoint can be set only for connected account payments
      // So this wouldn't work in production. We have to make that change
      // Would have to create another endpoint and that endpoint is suppose to accept payments for the connected accounts.
      // And then another endpoint that would accept payments for the agency subscriptions

      // So to distinguish this in a local environment, we added metadata to every payment that is being made, every subscription that has been made,
      // through the products that are being sold.
      if (
        !subscription.metadata.connectAccountPayments &&
        !subscription.metadata.connectAccountSubscriptions
      ) {
        switch (stripeEvent.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            if (subscription.status === "active") {
              await subscriptionCreated(
                subscription,
                subscription.customer as string
              );
              console.log("CREATED FROM WEBHOOK 💳", subscription);
            } else {
              console.log(
                "SKIPPED AT CREATED FROM WEBHOOK 💳 because subscription status is not active",
                subscription
              );
              break;
            }
          }
          default:
            console.log("👉🏻 Unhandled relevant event!", stripeEvent.type);
        }
      } else {
        console.log(
          "SKIPPED FROM WEBHOOK 💳 because subscription was from a connected account not for the application",
          subscription
        );
      }
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("🔴 Webhook Error", { status: 400 });
  }
  return NextResponse.json(
    {
      webhookActionReceived: true,
    },
    {
      status: 200,
    }
  );
}
