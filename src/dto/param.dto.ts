import { IsMongoId } from 'class-validator';

export class IsObjectIdDto {
  @IsMongoId()
  id: string;
}
