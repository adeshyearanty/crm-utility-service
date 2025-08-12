import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

import { ActivityModule } from './activity/activity.module';
import { AppController } from './app.controller';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'staging')
          .default('development'),
        PORT: Joi.number().default(3001),
        MONGO_USER: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        AWS_S3_BUCKET: Joi.string().required(),
        AWS_SSO_REGION: Joi.string().required(),
        AWS_IDENTITY_POOL_ID: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get(
          'MONGO_USER',
        )}:${configService.get(
          'MONGO_PASSWORD',
          // )}@miraki-training.gn5hy.mongodb.net/${configService.get(
        )}@gamyam.tumrpaj.mongodb.net/${configService.get(
          'MONGO_DATABASE',
        )}?retryWrites=true&w=majority`,
      }),
      inject: [ConfigService],
    }),
    ActivityModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
