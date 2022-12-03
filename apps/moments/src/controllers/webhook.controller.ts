/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Controller,
  Param,
  Post,
  HttpCode,
  Req,
  Res,
  RawBodyRequest,
  Get,
} from '@nestjs/common';
import { ApiService } from '../api.service';
import { ApiTags } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { stripe } from 'libs/stripe/stripe';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@ApiTags('Stripe Webhook')
@Controller()
export class WebhookController {
  constructor(
    private readonly apiService: ApiService,
    private readonly config: ConfigService,
  ) { }
  @HttpCode(200)
  @Post('/webhook')
  async handler(
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Res() res: FastifyReply,
  ) {
    if (req.method !== 'POST') {
      res.header('Allow', 'POST');
      res.status(405).send({ message: 'Method Not Allowed' });
      return;
    }
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

    if (event.type !== 'charge.succeeded') {
      return res.status(400).send('Not a charge succeeded event');
    }

    // Handle the event
    switch (event.type) {
      case 'charge.succeeded':
        const paymentIntentC = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful!', paymentIntentC);
        break;
      case 'payment_intent.succeeded':
        const paymentIntentS = event.data.object;
        console.log('PaymentIntent was successful!', paymentIntentS);
        break;
      case 'payment_method.attached':
        const paymentMethodA = event.data.object;
        console.log(
          'PaymentMethod was attached to a Customer!',
          paymentMethodA,
        );
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send('Success');
  }
}
