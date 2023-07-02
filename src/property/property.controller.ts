import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CommentDto, CreatePropertyDto } from '../dto/create.property';
import { UserDec, UserReq } from '../user/decorators/user.decorators';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { AdminGuard } from '../gaurd/admin.guard';
import { AuthGuard } from '../gaurd/auth.gaurd';
import { RolesGuard } from '../gaurd/roles.gaurd';
import { ParseObjectIdPipe } from 'src/validateID/validate-id';
import { json } from 'body-parser';
import { UpdatePropertyDto } from 'src/dto/update.property';

@Controller('property')
export class PropertyController {
  constructor(
    private propertyService: PropertyService,
    @InjectModel(User.name)
    private userService: Model<UserDocument>,
  ) {}

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Post('add')
  async addProperty(@Body() body: CreatePropertyDto, @UserDec() user: UserReq) {
    const id = user.id;

    // check if the user exist
    const findUser = await this.userService.findOne({ _id: id });

    if (!findUser) {
      throw new Error('user does not exist');
    }

    const userId = findUser._id.toString();
    return await this.propertyService.addProperty(body, userId);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Get('all')
  async getAllProperty() {
    return await this.propertyService.getAllProperty();
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Get(':id')
  async getOneProperty(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.propertyService.getOneProperty(id);
  }

  @UseGuards(AuthGuard)
  @Post('comment/:id')
  async addComment(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() reviews: string,
    @UserDec() user: UserReq,
  ) {
    const userId = user.id.toString();
    return await this.propertyService.addComment(reviews, id, userId);
  }

  @Patch('update/:id')
  async updatePropertyDetails(
    @Param('id') id: string,
    @UserDec() user: UserReq,
    property: UpdatePropertyDto,
  ) {
    const userId = user.id.toString();
    return await this.propertyService.updateProperty(property, id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch('comment/remove/:id')
  async removeComment(
    @Param('id', ParseObjectIdPipe) id: string,
    @UserDec() user: UserReq,
  ) {
    const userId = user.id.toString();
    return await this.propertyService.removeComment(id, userId);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Patch('listed/:id')
  async listedStatusUpdate(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.propertyService.listedProperty(id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Patch('listed/:id')
  async unlistedStatusUpdate(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.propertyService.unlistProperty(id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Delete('delete/:id')
  async deleteProperty(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.propertyService.deleteProperty(id);
  }
}
