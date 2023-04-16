import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

// Middleware
import { CommonRequestMiddleware } from './middlewares/common.request.middleware';
import { RequestMiddleware } from './middlewares/request.middleware';
import { User, UserSchema } from './models/user.model';
import { AuthService } from './modules/auth/auth.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
        algorithm: 'HS256',
      },
    }),
    MongooseModule.forRoot(process.env.DB),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // IF USE MINIO
    // MinioModule.register({
    //   isGlobal: true,
    //   endPoint: process.env.MINIO_ENDPOINT,
    //   useSSL: true,
    //   accessKey: process.env.MINIO_ACCESS_KEY,
    //   secretKey: process.env.MINIO_SECRET_KEY,
    // }),

    // Endpoint MODULE
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Common Request
    consumer.apply(CommonRequestMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });

    // JWT User Request
    consumer.apply(RequestMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
