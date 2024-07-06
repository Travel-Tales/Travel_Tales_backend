import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserTravelPost, TravelPost } from './entities';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from './common/middlewares/jwt.middleware';
import { PostModule } from './post/post.module';
import { EventModule } from './event/event.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { MailModule } from './mail/mail.module';
import { InvitationVerification } from './entities/invitation.verification.entitiy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_SECRET_KEY: Joi.string().required(),
        SERVER_URL: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().required(),
        REDIRECT_URL: Joi.string().required(),
        ACCESS_SECRET_KEY: Joi.string().required(),
        REFRESH_SECRET_KEY: Joi.string().required(),
        ACCESS_SECRET_EXPIRATION: Joi.string().required(),
        REFRESH_SECRET_EXPIRATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: process.env.NODE_ENV === 'dev' ? true : false,
      synchronize: process.env.NODE_ENV === 'dev' ? true : false,
      entities: [User, UserTravelPost, TravelPost, InvitationVerification],
      extra: {
        connectionTimeoutMillis: 10000,
        ssl: { rejectUnauthorized: process.env.NODE_ENV === 'prod' },
        postgres: {
          extensions: ['pgvector'],
        },
      },
    }),
    AuthModule,
    JwtModule,
    UserModule,
    PostModule,
    EventModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(JwtMiddleware)
      .exclude({ path: 'auth/refresh', method: RequestMethod.ALL })
      .forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
