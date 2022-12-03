import { Schema, SchemaTypes, type InferSchemaType } from 'mongoose';

export const TransactionSchemaName = 'Transaction';

export const TransactionSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      auto: true,
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
      type: SchemaTypes.Number,
    },
    spacesCount: {
      type: SchemaTypes.Number,
    },
    paymentSucceeded: {
      type: SchemaTypes.Boolean,
    },
    provider: {
      type: SchemaTypes.String,
    },
    paymentId: {
      type: SchemaTypes.String,
    },
    stripeProductId: {
      type: SchemaTypes.String,
    },
    transactionStatus: {
      type: SchemaTypes.Number,
    },
  },
  { timestamps: true },
);

export type ITransaction = InferSchemaType<typeof TransactionSchema>;
