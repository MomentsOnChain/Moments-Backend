import { Schema, SchemaTypes, type InferSchemaType } from 'mongoose';

export const TransactionSchemaName = 'Transaction';

export const TransactionSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      auto: true,
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
    paymentStatus: {
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
  },
  { timestamps: true },
);

export type ITransaction = InferSchemaType<typeof TransactionSchema>;
