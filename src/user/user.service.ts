import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDocument, User } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../token/jwt.token';
import { CreateUserDto, SigninUserDto } from '../dto/createUser.dto';
import * as bcrypt from 'bcryptjs';
// import { IsObjectIdDto } from '../dto/param.dto';
// import { Types } from 'mongoose';
import { Response, Request } from 'express';
import { MailService } from './mailer/sendMail';

// interface SignInReturnData {
//   accessToken: string;
//   email: string;
//   role: string;
//   id: Types.ObjectId;
// }

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtToken: Token,
    private mailService: MailService,
  ) {}

  // TODO: ADD MAILING SERVICE
  // TODO: ADD FORGOT AND RESET PASSWORD
  // TODO: UPDATE USER ACCT
  // TODO: ADD PROFILE IMAGE FOR THE USER

  async sendMail() {
    const userMail = 'seunolanitori@gmail.com';
    const senderMail = 'seunolanitori@hotmail.com';
    return this.mailService.sendMail(userMail, senderMail);
  }

  async createUser(createUser: CreateUserDto) {
    const userExist = await this.userModel.findOne({ email: createUser.email });

    if (userExist) {
      throw new HttpException('User Exist', HttpStatus.BAD_REQUEST);
    }

    const password = createUser.password;

    const hashPwd = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email: createUser.email,
      password: hashPwd,
      roles: createUser.roles,
    });

    try {
      return await newUser.save();
    } catch (error) {
      console.log('ERROR: ', error);
      throw new HttpException(
        'Error in creating new account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signinUser(signIn: SigninUserDto, res: Response) {
    const { email, password } = signIn;

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new HttpException('User Does Not Exist', HttpStatus.BAD_REQUEST);
    }

    const comparePwd = await bcrypt.compare(password, user.password);

    if (!comparePwd) {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }

    const token = await this.jwtToken.createToken(user._id);

    if (!token) {
      throw new Error('problem with access token');
    }

    const refreshToken = await this.jwtToken.refreshToken(user._id);

    if (!refreshToken) {
      throw new Error('problem with refresh token');
    }

    try {
      const saveRefreshToken = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { $push: { refreshToken: refreshToken } },
        { new: true },
      );

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'successfull login',
        data: saveRefreshToken,
        token,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logoutUser(res: Response, req: Request, userId: string) {
    const token = req?.cookies?.jwt;

    try {
      if (!token) {
        throw new Error('no token');
      }

      const user = await this.userModel.findOne({ _id: userId });

      if (!user) {
        throw new Error('user does not exist');
      }

      const foundToken = user.refreshToken.includes(token);

      if (!foundToken) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.status(201).json({ message: 'user not logged in' });
      }

      const updateUser = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        { $pull: { refreshToken: token } },
        { new: true },
      );

      res.clearCookie('jwt', { httpOnly: true });
      res.status(200).json({ message: 'user logged out', data: updateUser });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAlluser() {
    const user = await this.userModel.find({});
    return user;
  }

  async getOneUser(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      throw new NotFoundException(`No such a user found`);
    }

    return user;
  }

  async deleteUser(id: string) {
    try {
      const deleteUser = await this.userModel.findOneAndRemove({ _id: id });

      return {
        user: deleteUser,
        message: 'user deleted',
      };
    } catch (error) {
      console.log('ERROR: ', error);
      throw new HttpException(
        `Error deleting User with ID ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
