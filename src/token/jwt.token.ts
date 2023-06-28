import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class Token {
  async createToken(id: Types.ObjectId) {
    const payload = { id: id.toString() };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    return token;
  }

  async refreshToken(id: Types.ObjectId) {
    const payload = { id: id.toString() };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });
    return token;
  }
}
