import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from '../schema/property.schema';
import { CreatePropertyDto } from '../dto/create.property';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name)
    private propertyService: Model<PropertyDocument>,
    @InjectModel(User.name) private userService: Model<UserDocument>,
  ) {}

  //   TODO: CREATE AN UPDATE PROPERTY
  //   TODO: ADD RATING AND REMOVE RATING
  //   TODO: ADD TOTAL RATING
  //   TODO: CREATE LISTED AND UNLISTED PROPERTY
  //   TODO: ADD IMAGES AND VIDEOS TO THE PROPERTY

  async addProperty(property: CreatePropertyDto, userId: string) {
    // check if the same property exist in db
    const address = property.address;

    const findProperty = await this.propertyService.findOne({
      address: address,
    });

    if (findProperty) {
      throw new HttpException(
        'can not add the same property',
        HttpStatus.CONFLICT,
      );
    }

    const newProperty = new this.propertyService({
      user: userId,
      ...property,
    });

    try {
      await newProperty.save();
      return newProperty;
    } catch (error) {
      console.log('Error: ', error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProperty() {
    return await this.propertyService.find({});
  }

  async getOneProperty(id: string) {
    try {
      const property = await this.propertyService
        .findOne({ _id: id })
        .populate('user');

      return property;
    } catch (error) {
      console.log('ERROR: ', error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addComment(reviews: string, id: string, userId: string) {
    const property = await this.propertyService.findOne({ _id: id });

    if (!property) {
      throw new Error('property does not exist');
    }

    const user = await this.userService.findOne({ _id: userId });

    if (!user) {
      throw new Error('user does not exist');
    }

    try {
      const alreadyCommented = property.comments.find(
        (id) => id.postedBy.toString() === userId.toString(),
      );

      let updateComment;
      if (alreadyCommented) {
        updateComment = await this.propertyService.updateOne(
          {
            comments: { $elemMatch: alreadyCommented },
          },
          { $set: { 'comments.$.reviews': reviews } },
          { new: true },
        );
      } else {
        updateComment = await this.propertyService.findOneAndUpdate(
          {
            _id: id,
          },
          { $push: { comments: { postedBy: userId, reviews } } },
          { new: true },
        );
      }

      return {
        updateComment,
      };
    } catch (error) {
      console.log('ERROR: ', error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeComment(id: string, userId: string) {
    const property = await this.propertyService.findOne({ _id: id });
    if (!property) {
      throw new HttpException('property does not exist', HttpStatus.NOT_FOUND);
    }

    try {
      const commentIndex = property.comments.findIndex(
        (Comment) => Comment.postedBy.toString() === userId,
      );

      if (commentIndex === -1) {
        throw new UnauthorizedException();
      }

      property.comments.splice(commentIndex, 1);
      return await property.save();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}