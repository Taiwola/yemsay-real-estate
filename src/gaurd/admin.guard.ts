import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) public userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      // No roles specified, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = request?.headers?.authorization?.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET) as PayloadObj;

    const user = await this.userModel.findOne({ _id: payload.id });

    const userRoles: UserRoles = user?.roles;

    if (!userRoles || userRoles !== 'ADMIN') {
      // User roles do not include ADMIN role, deny access
      return false;
    }

    // User has the ADMIN role, allow access
    return true;
  }
}
