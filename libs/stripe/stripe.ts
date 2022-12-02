import Stripe from 'stripe';
import * as dotenv from 'dotenv';
dotenv.config();

if (process.env.STRIPE_SEC_KEY === undefined) {
  throw new Error('STRIPE_SEC_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SEC_KEY, {
  apiVersion: '2022-11-15',
});
