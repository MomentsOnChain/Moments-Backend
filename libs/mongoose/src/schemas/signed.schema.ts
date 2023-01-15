import { Schema, SchemaTypes, type InferSchemaType } from 'mongoose';

export const SignedSchemaName = 'Signed';

export const SignedSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      auto: true,
    },
    userId: {
      required: true,
      type: SchemaTypes.ObjectId,
    },
    expire: {
      required: true,
      type: SchemaTypes.Date,
    },
    signedUrl: {
      required: true,
      type: SchemaTypes.String,
    },
  },
  { timestamps: true },
);

export type ISigned = InferSchemaType<typeof SignedSchema>;
