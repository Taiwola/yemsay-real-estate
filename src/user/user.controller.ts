import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SigninUserDto } from '../dto/createUser.dto';
import { ParseObjectIdPipe } from '../validateID/validate-id';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/gaurd/roles.gaurd';
import { AdminGuard } from '../gaurd/admin.guard';
import { AuthGuard } from '../gaurd/auth.gaurd';
import { UserRoles } from 'src/schema/user.schema';
import { Response, Request } from 'express';
import { UserReq, UserDec } from './decorators/user.decorators';
// import { IsObjectIdDto } from '../dto/param.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('get')
  async getAllUser() {
    return await this.userService.getAlluser();
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Get(':id')
  async getOneUser(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.getOneUser(id);
  }

  @Post('signin')
  async signinUser(@Body() body: SigninUserDto, @Res() res: Response) {
    return await this.userService.signinUser(body, res);
  }

  @Post('create')
  async createUser(@Body() createUser: CreateUserDto) {
    return await this.userService.createUser(createUser);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logoutUser(
    @Res() res: Response,
    @UserDec() userReq: UserReq,
    @Req() req: Request,
  ) {
    const userId = userReq.id.toString();

    return await this.userService.logoutUser(res, req, userId);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @UserDec() user: UserReq,
  ) {
    console.log(user);
    return this.userService.deleteUser(id);
  }

  @Post('mail')
  sendMail() {
    return this.userService.sendMail();
  }
}
