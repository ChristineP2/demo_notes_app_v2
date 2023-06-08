import handler from "@notes/core/handler";
import Stripe from "stripe";
import {calculateCost} from "@notes/core/cost";
import {APIGatewayProxyEvent} from "aws-lambda";
import {Config} from "sst/node/config";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  let data = {
    storage: 0,
    source: null
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const { storage, source } = data;

  if (storage === 0 || source === null) {
    throw new Error("Please provide valid transaction details.");
  }

  const amount: number = calculateCost(storage);
  const description: string = "Scratch charge";

  // Load our secret key
  const stripe = new Stripe(Config.STRIPE_SECRET_KEY,{
    apiVersion: '2022-11-15',
  });

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  return { status: true };
});
