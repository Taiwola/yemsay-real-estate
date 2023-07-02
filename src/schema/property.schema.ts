import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import Mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type PropertyDocument = HydratedDocument<Property>;

export enum PropertyType {
  LAND = 'LAND',
  HOUSE = 'HOUSE',
}

@Schema()
export class Property {
  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: Mongoose.Schema.Types.ObjectId | User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  numberOfBathroom: number;

  @Prop({ required: true })
  numberOfBedroom: number;

  @Prop({ required: true })
  landSize: string;

  @Prop({ default: true })
  listed: boolean;

  @Prop({ default: false })
  unlisted: boolean;

  @Prop({ required: true })
  propertyType: PropertyType;

  @Prop()
  comments: [
    {
      postedBy: { type: Mongoose.Schema.Types.ObjectId; ref: 'User' };
      reviews: string;
    },
  ];

  @Prop()
  numbOfReviews: number;

  @Prop({
    type: [
      {
        postedBy: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
        reviews: String,
      },
    ],
  })
  rating: [
    {
      postedBy: User;
      star: number;
    },
  ];

  @Prop()
  totalRating: number;

  @Prop()
  videoUrl: string;

  @Prop()
  imageUrls?: Array<string>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const propertySchema = SchemaFactory.createForClass(Property);
