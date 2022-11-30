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
    spacesBought: {
      required: true,
      type: SchemaTypes.Number,
    },
    success: {
      required: true,
      type: SchemaTypes.Boolean,
    },
  },
  { timestamps: true },
);

export type ITransaction = InferSchemaType<typeof TransactionSchema>;
