import { Schema, SchemaTypes, type InferSchemaType } from 'mongoose';

export const SpacesSchemaName = 'Spaces';

export const SpacesSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      auto: true,
    },
    userId: {
      required: true,
      type: SchemaTypes.ObjectId,
    },
    transactionId: {
      required: true,
      type: SchemaTypes.ObjectId,
    },
    spaces: {
      type: SchemaTypes.Number,
      default: 100,
    },
  },
  { timestamps: true },
);

export type ISpaces = InferSchemaType<typeof SpacesSchema>;
