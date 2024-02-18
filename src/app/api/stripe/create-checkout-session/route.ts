import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    subAccountConnectAccId,
    prices,
    subaccountId,
  }: {
    subAccountConnectAccId: string;
    prices: { recurring: boolean; productId: string }[];
    subaccountId: string;
  } = await req.json();

  const origin = req.headers.get("origin");
  if (!subAccountConnectAccId || !prices.length)
    return new NextResponse("Stripe Account Id or price id is missing", {
      status: 400,
    });
  if (
    !process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT ||
    !process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE ||
    !process.env.NEXT_PUBLIC_PLATFORM_AGENY_PERCENT
  ) {
    console.log("VALUES DONT EXITS");
    return NextResponse.json({ error: "Fees do not exist" });
  }

  /***** NOTE: This section below is not needed unless doing the challenge. ******/
  // What this section does: It checks to see if the agency account is connected, and if connected, then we can transfer fees
  // to their account too. So for every transaction we would be sending them a piece of the cake too (15:11:00)

  // Not needed unless we want to send payments to this account.
  //CHALLENGE Transfer money to a connected
  // const agencyIdConnectedAccountId = await db.subAccount.findUnique({
  //   where: { id: subaccountId },
  //   include: { Agency: true },
  // })

  // NOTE: Subscription prices and one time prices can exist together but they need to be set up bit
  // differently. Which means inside the checkout sesison, you have to provide information on wether they are
  // payment intent data or subscription related data. And if they are subscription related data, you can only charge
  // application fee percentages and you can only charge application fee amount for payment intent data
  // And for a subscription. So lets say they had a subscription, the subscription must have ofc 1 subscription. So you cannot have a
  // subscription based payment intent and not have any products in there. So that means we have to identify if they are selling any recurring
  // products
  // In simple terms, we need to know if there are any subscription prices before we move forward (see 15:00:09)
  const subscriptionPriceExists = prices.find((price) => price.recurring);
  // if (!agencyIdConnectedAccountId?.Agency.connectAccountId) {
  //   console.log('Agency is not connected')
  //   return NextResponse.json({ error: 'Agency account is not connected' })
  // }
  /* This section above is not needed unless doing the challenge */

  try {
    console.log("attempting to create stripe checkout session!");
    const session = await stripe.checkout.sessions.create(
      {
        line_items: prices.map((price) => ({
          price: price.productId, // this actually not the productId, this is the priceId, but we are storing it in our db as productId
          quantity: 1,
        })),
        // subscription data
        ...(subscriptionPriceExists && {
          subscription_data: {
            metadata: { connectAccountSubscriptions: "true" }, // when we were creating subscriptions for the panorama app, we had some metadata that we were looking at, this where it comes from
            application_fee_percent:
              +process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT,
          },
        }),
        // payment intent data
        ...(!subscriptionPriceExists && {
          payment_intent_data: {
            metadata: { connectAccountPayments: "true" },
            application_fee_amount:
              +process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE * 100,
          },
        }),

        mode: subscriptionPriceExists ? "subscription" : "payment",
        ui_mode: "embedded",
        redirect_on_completion: "never",
      },
      { stripeAccount: subAccountConnectAccId }
    );
    console.log("Creted stripe checkout session!!");
    console.log({ session });

    return NextResponse.json(
      {
        clientSecret: session.client_secret,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.log("🔴 api/stripe/create-checkout-session Error", error);
    //@ts-ignore
    return NextResponse.json({ error: error.message });
  }
}

export async function OPTIONS(request: Request) {
  const allowedOrigin = request.headers.get("origin");
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400",
    },
  });

  return response;
}
