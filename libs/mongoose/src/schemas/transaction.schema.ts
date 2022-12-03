import { Schema, SchemaTypes, type InferSchemaType } from 'mongoose';

export const TransactionSchemaName = 'Transaction';

export const TransactionSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
    },
    transactionId: {
      type: SchemaTypes.String,
      required: true,
    },
    userId: {
      required: true,
      type: SchemaTypes.ObjectId,
    },
    amount: {
      required: true,
      type: SchemaTypes.Number,
    },
    spacesCount: {
      required: true,
      type: SchemaTypes.Number,
    },
    paymentSucceeded: {
      required: true,
      type: SchemaTypes.Boolean,
    },
    provider: {
      required: true,
      type: SchemaTypes.String,
    },
    paymentId: {
      required: true,
      type: SchemaTypes.String,
    },
    stripeProductId: {
      type: SchemaTypes.String,
      required: true,
    },
    transactionStatus: {
      type: SchemaTypes.Number,
      required: true,
    },
  },
  { timestamps: true },
);

export type ITransaction = InferSchemaType<typeof TransactionSchema>;
