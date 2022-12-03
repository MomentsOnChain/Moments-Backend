/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Controller,
  Post,
  HttpCode,
  Req,
  Res,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { stripe } from 'libs/stripe/stripe';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { MongoSpacesService, TransactionService } from '@app/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { TransactionStatus } from '@config/transaction.enums';
import cacheDb from '../../../../libs/sqlite/sqlite';

@ApiTags('Stripe Webhook')
@Controller()
export class WebhookController {
  constructor(
    private readonly sService: MongoSpacesService,
    private readonly tService: TransactionService,
    private readonly config: ConfigService,
  ) {}
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
      console.log(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'charge.succeeded':
        console.log('charge.succeeded', event);
        const chargeObject = event.data.object as Stripe.Charge;
        // Fulfill the purchase...
        const charge = await stripe.checkout.sessions.retrieve(
          chargeObject.id,
          {
            expand: ['line_items'],
          },
        );
        if (!charge) {
          // make transaction status failed
          console.log('session not found');
          return res.status(400).send('No session found');
        }
        // Get the quantity
        console.log(charge?.line_items?.data[0].quantity, 'quantity 2');
        // Get the product ID
        console.log(charge?.line_items?.data[0]?.price?.product, 'product 2');
        if (!chargeObject?.metadata?.transactionId)
          return res.status(400).send('No transaction found');
        if (!chargeObject?.metadata?.userId)
          return res.status(400).send('No user found');

        const transaction = await this.tService.updateOneByUid(
          chargeObject.metadata.transactionId,
          {
            paymentSucceeded: true,
            transactionStatus: TransactionStatus.Success,
          },
        );
        const uId = new SchemaTypes.ObjectId(chargeObject.metadata.userId);
        if (!transaction) {
          console.log('transaction not found');
          return res.status(400).send('No transaction found');
        }

        const tId = transaction._id;
        this.sService.create({
          userId: uId as unknown as Types.ObjectId,
          transactionId: tId,
          spacesSize: 100,
        });
        break;
      case 'charge.failed':
        console.log('charge.failed');
        const failedObject = event.data.object as Stripe.Charge;
        // Fulfill the purchase...
        const failed = await stripe.checkout.sessions.retrieve(
          failedObject.id,
          {
            expand: ['line_items'],
          },
        );
        if (!failed) {
          // make transaction status failed
          console.log('session not found');
          return res.status(400).send('No session found');
        }
        // Get the quantity
        console.log(failed?.line_items?.data[0].quantity, 'quantity 3');
        // Get the product ID
        console.log(failed?.line_items?.data[0]?.price?.product, 'product 3');
        if (!failedObject?.metadata?.transactionId)
          return res.status(400).send('No transaction found');

        this.tService.updateOneByUid(failedObject.metadata.transactionId, {
          paymentSucceeded: false,
          transactionStatus: TransactionStatus.Failed,
        });
        break;

      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send('Success');
  }
}
