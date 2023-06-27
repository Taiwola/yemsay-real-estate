import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { ParseObjectIdPipe } from '../validateID/validate-id';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/gaurd/auth.gaurd';
import { UserRoles } from 'src/schema/user.schema';
// import { IsObjectIdDto } from '../dto/param.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get')
  async getAllUser() {
    return await this.userService.getAlluser();
  }

  @Get(':id')
  async getOneUser(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.getOneUser(id);
  }

  @Post('create')
  async createUser(@Body() createUser: CreateUserDto) {
    return await this.userService.createUser(createUser);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}