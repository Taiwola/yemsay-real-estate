import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid Object ID');
    }
    return value;
  }
}
