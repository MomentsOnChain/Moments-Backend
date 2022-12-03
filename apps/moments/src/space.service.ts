import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v4 } from 'uuid';
// import { cacheDatabase } from '@app/sqlite';
import { CreateTransactionDto, TransactionService } from '@app/mongoose';
import { stripe } from 'libs/stripe/stripe';
import cacheDb from '../../../libs/sqlite/sqlite';

@Injectable()
export class SpacesService {
  constructor(
    private config: ConfigService,
    private tService: TransactionService,
  ) {}
  async handler(data: CreateTransactionDto) {
    const { priceId, userId, spaces } = data;
    console.log('spaces', spaces);
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
      metadata: {
        userId,
        transactionId: id,
        spacesCount: spaces,
      },
    });
    cacheDb.set(id, {
      userId,
      transactionId: id,
    });
    return stripeSession.url;
  }
}
