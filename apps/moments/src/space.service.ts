import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v4 } from 'uuid';
// import { cacheDatabase } from '@app/sqlite';
import { CreateTransactionDto } from '@app/mongoose';
import { stripe } from 'libs/stripe/stripe';
import cacheDb from '../../../libs/sqlite/sqlite';

@Injectable()
export class SpacesService {
  constructor(private config: ConfigService) {}
  async handler(data: CreateTransactionDto) {
    const { priceId, userId, spaces } = data;
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
      success_url: `${frontendURL}/admin/space/new?success=true`,
      cancel_url: `${frontendURL}/admin/space/new?success=false`,
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
