export interface IBucketOption {
  Bucket: string;
  Key: string;
  Body?: Buffer;
  ContentType?: string;
}
