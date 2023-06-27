import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const requestToken = request?.headers?.authorization;

    const token = requestToken?.split(' ')[1];

    const decoded = jwt.decode(token);

    request.user = decoded;

    return handler.handle();
  }
}
