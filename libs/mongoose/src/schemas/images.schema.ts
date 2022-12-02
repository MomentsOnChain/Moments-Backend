import { Schema, SchemaTypes, type InferSchemaType } from 'mongoose';

export const ImagesSchemaName = 'Images';

export const ImagesSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      auto: true,
    },
    spaceId: {
      required: true,
      type: SchemaTypes.ObjectId,
    },
    // todo: brainstorm adding block chain wallet address for event attendees
    url: {
      type: SchemaTypes.String,
      required: true,
    },
    metaData: {
      type: SchemaTypes.String,
    },
  },
  { timestamps: true },
);

export type IImages = InferSchemaType<typeof ImagesSchema>;
