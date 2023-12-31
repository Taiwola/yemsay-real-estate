import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User, UserDocument, UserRoles } from '../schema/user.schema';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

interface PayloadObj {
  id: Types.ObjectId;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) public userModel: Model<UserDocument>) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request?.headers?.authorization?.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET) as PayloadObj;

    const user = await this.userModel.findOne({ _id: payload.id });
    return !!user; // Returns true if the user object exists, indicating authentication
  }
}
