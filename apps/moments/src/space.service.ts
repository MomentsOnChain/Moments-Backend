import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v4 } from 'uuid';
// import { cacheDatabase } from '@app/sqlite';
import { CreateTransactionDto } from '@app/mongoose';
import { stripe } from 'libs/stripe/stripe';

@Injectable()
export class SpacesService {
  constructor(private config: ConfigService) {}
  async handler(data: CreateTransactionDto) {
    const { priceId, userId } = data;
    const id = v4();
    const frontendURL = this.config.getOrThrow('FrontEndUrl');
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 100,
          },
        },
      ],

      mode: 'payment',
      success_url: `${frontendURL}/transaction/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendURL}/transaction/cancel`,
      payment_intent_data: {
        metadata: {
          userId,
          transactionId: id,
          createdAt: Date.now(),
        },
      },
    });
    // await cacheDatabase.set(id, {
    //   userId,
    //   amount,
    //   createdAt: Date.now(),
    //   spacesCount,
    //   provider: 'stripe',
    //   quantity,
    //   transactionId: id,
    // });
    return stripeSession.url;
  }
}
