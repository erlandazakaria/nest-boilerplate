import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import { PermissionGuard } from '../../libs/permission.guard';
import { User, UserSchema } from '../../models/user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, { provide: APP_GUARD, useClass: PermissionGuard }],
})
export class UserModule {}
