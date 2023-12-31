import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
// import { User, userSchema } from './models/user.model';
import { Token } from './token/jwt.token';
import { User, userSchema } from './schema/user.schema';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptor/user.interceptor';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './user/mailer/sendMail';
import { Property, propertySchema } from './schema/property.schema';
import { PropertyService } from './property/property.service';
import { PropertyController } from './property/property.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Property.name, schema: propertySchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'seunolanitori@gmail.com',
          pass: 'powerhouse',
        },
      },
    }),
  ],
  controllers: [AppController, UserController, PropertyController],
  providers: [
    AppService,
    Token,
    UserService,
    MailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    PropertyService,
  ],
})
export class AppModule {}
