import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: UserRoles.USER })
  roles: UserRoles;

  @Prop()
  refreshToken: Array<string>;
}

export const userSchema = SchemaFactory.createForClass(User);
