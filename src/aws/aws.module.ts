// src/utils/aws-config.module.ts
import { Module, Global } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsService } from './aws.service';

@Global()
@Module({
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
