import { Schema, SchemaTypes, type InferSchemaType } from 'mongoose';

export const UserSchemaName = 'User';

export const UserSchema = new Schema(
  {
    _id: {
      type: SchemaTypes.ObjectId,
      auto: true,
    },
    email: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    password: {
      type: SchemaTypes.String,
    },
    avatar: {
      type: SchemaTypes.String,
    },
    deleted: {
      type: SchemaTypes.Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export type IUser = InferSchemaType<typeof UserSchema>;
