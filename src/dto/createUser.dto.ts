import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRoles } from '../schema/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  roles: UserRoles;
}

export class SigninUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
