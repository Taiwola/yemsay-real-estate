import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { UserDocument, User, UserRoles } from '../schema/user.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

interface PayloadObj {
  id: Types.ObjectId;
  iat: number;
  exp: number;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    public reflector: Reflector,
    @InjectModel(User.name) public userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const role = this.reflector.get<UserRoles[]>('roles', context.getHandler());

    if (role && role.length > 0) {
      try {
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET) as PayloadObj;

        const user = await this.userModel.findOne({ _id: payload.id });

        if (!user) {
          return false;
        }

        if (role.includes(user.roles)) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
        throw new HttpException(
          'internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      return false;
    }
  }
}
