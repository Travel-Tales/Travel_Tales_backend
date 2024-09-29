// src/utils/aws-config.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as AWS from 'aws-sdk';
import { AwsService } from './aws.service';
import { FileAttachment } from 'src/entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileAttachment])],
  providers: [
    {
      provide: 'AWS',
      useFactory: () => {
        AWS.config.update({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
          },
        });
        return AWS;
      },
    },
    AwsService,
  ],
  exports: [AwsService],
})
export class AwsModule {}
