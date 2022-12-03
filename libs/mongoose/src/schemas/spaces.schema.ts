import { Schema, SchemaTypes, type InferSchemaType } from 'mongoose';

export const SpacesSchemaName = 'Spaces';

export const SpacesSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      auto: true,
    },
    spaceName: {
      // required: true,
      type: SchemaTypes.String,
    },
    userId: {
      required: true,
      type: SchemaTypes.ObjectId,
    },
    transactionId: {
      required: true,
      type: SchemaTypes.ObjectId,
    },
    spacesSize: {
      type: SchemaTypes.Number,
      default: 100,
    },
    isMinted: {
      type: SchemaTypes.Boolean,
      default: false,
    },
    blockChainName: {
      type: SchemaTypes.String,
    },
    blockChainAddr: {
      type: SchemaTypes.String,
    },
    combinedImageURL: {
      type: SchemaTypes.String,
    },
  },
  { timestamps: true },
);

export type ISpaces = InferSchemaType<typeof SpacesSchema>;
