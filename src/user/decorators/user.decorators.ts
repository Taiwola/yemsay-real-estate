import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

export interface UserReq {
  id: Types.ObjectId;
  iat: number;
  exp: number;
}

export const UserDec = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
