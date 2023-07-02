import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  address: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  numberOfBathroom: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  numberOfBedroom: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  landSize: string;
}

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  reviews: string;
}
