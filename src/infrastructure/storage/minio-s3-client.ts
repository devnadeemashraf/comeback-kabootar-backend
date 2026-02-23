import { S3Client } from '@aws-sdk/client-s3';

import type { AppConfig } from '@/config/app';

/**
 * Create an S3 client configured for MinIO (custom endpoint, path-style).
 * Used by MinioStorageFacade for presigned URLs and delete.
 */
export function createMinioS3Client(minioConfig: AppConfig['minio']): S3Client {
  return new S3Client({
    endpoint: minioConfig.endpoint,
    region: 'us-east-1', // MinIO ignores but SDK requires
    credentials: {
      accessKeyId: minioConfig.accessKey,
      secretAccessKey: minioConfig.secretKey,
    },
    forcePathStyle: true, // required for MinIO
  });
}
