/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Controller,
  Post,
  HttpCode,
  Req,
  Res,
  RawBodyRequest,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { stripe } from 'libs/stripe/stripe';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { MongoSpacesService, TransactionService } from '@app/mongoose';
import { TransactionStatus } from '@config/transaction.enums';
import cacheDb from '../../../../libs/sqlite/sqlite';

@Controller()
export class WebhookController {
  constructor(
    private readonly sService: MongoSpacesService,
    private readonly tService: TransactionService,
    private readonly config: ConfigService,
  ) {}
  transactionMap = new Map();
  @HttpCode(200)
  @Post('/webhook')
  async handler(
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Res() res: FastifyReply,
  ) {
    const sig = req.headers['stripe-signature'] as string;

    let event: any;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody as Buffer,
        sig,
        this.config.getOrThrow('endpointSecret'),
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        let checkout = event.data.object as Stripe.Checkout.Session;
        const transactionId = checkout?.metadata?.transactionId;
        if (!checkout?.metadata?.transactionId || !checkout?.metadata?.userId) {
          return res
            .status(400)
            .send('checkout.session.completed: no metadata');
        }
        const transaction = this.transactionMap.get(transactionId);
        if (transaction?.seen) {
          return res.status(200).send({ message: 'Payment already claimed.' });
        }
        this.transactionMap.set(transactionId, { seen: true });
        // Save an order in your database, marked as 'awaiting payment'
        await this.tService.create({
          userId: checkout.metadata.userId as any,
          transactionId: checkout.metadata.transactionId,
          amount: null as any,
          spacesCount: null as any,
          stripeProductId: checkout.metadata.stripeProductId as any,
          paymentSucceeded: false,
          provider: 'stripe',
          paymentId: null as any,
          transactionStatus: TransactionStatus.Pending,
        });

        if (checkout.payment_status == 'paid')
          await this.fullFillOrder(checkout);
        break;

      case 'checkout.session.async_payment_succeeded':
        checkout = event.data.object as Stripe.Checkout.Session;
        if (!checkout?.metadata?.transactionId || !checkout?.metadata?.userId) {
          return res
            .status(400)
            .send('checkout.session.async_payment_succeeded: no metadata');
        }
        await this.fullFillOrder(checkout);
        break;

      case 'checkout.session.async_payment_failed':
        checkout = event.data.object as Stripe.Checkout.Session;
        if (!checkout?.metadata?.transactionId || !checkout?.metadata?.userId) {
          return res
            .status(400)
            .send('checkout.session.async_payment_failed: no metadata');
        }
        await this.tService.updateOneByUid(checkout.metadata.transactionId, {
          transactionStatus: TransactionStatus.Failed,
        });
        break;
      // ... handle other event types
    }
    res.status(200).send('Success');
  }

  async fullFillOrder(session: Stripe.Checkout.Session) {
    const transactionId = session?.metadata?.transactionId;
    const userId = session?.metadata?.userId;
    if (!transactionId) return;
    const data = await cacheDb.get(transactionId);
    if (!data) return;
    cacheDb.delete(transactionId);

    const sessionS = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    });

    const quantity = sessionS.line_items?.data[0].quantity;
    if (!quantity) return;

    const amount = session.amount_total;
    const dbTId = await this.tService.updateOneByUid(
      session?.metadata?.transactionId ?? '',
      {
        paymentSucceeded: true,
        paymentId: session?.payment_intent,
        transactionStatus: TransactionStatus.Success,
        amount,
        spacesCount: quantity,
      },
    );

    const prs = [];
    for (let i = 0; i < quantity; i++) {
      prs.push({
        insertOne: {
          document: {
            userId: userId as any,
            transactionId: dbTId as any,
            spaceSize: session?.metadata?.spacesCount as any,
            isMinted: false,
          },
        },
      });
    }
    const res = await this.sService.bulkWrite(prs);
    console.log(res);
    // create s3 folder
    for (let i = 0; i < res.insertedCount; i++) {
      console.log(res.insertedIds[i].toString());
      console.log(
        await this.sService.createS3Folder(res.insertedIds[i].toString()),
      );
    }
  }
}
