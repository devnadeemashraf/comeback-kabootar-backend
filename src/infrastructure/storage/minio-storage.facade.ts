import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { injectable } from 'tsyringe';

import { createMinioS3Client } from './minio-s3-client';

import { config } from '@/config/app';
import type {
  PresignedPutResult,
  TemplateStorageFacade,
} from '@/infrastructure/storage/storage.types';

const PRESIGN_EXPIRES_IN_SEC = 3600; // 1 hour

@injectable()
export class MinioStorageFacade implements TemplateStorageFacade {
  private readonly client = createMinioS3Client(config.minio);
  private readonly bucket = config.minio.bucket;

  async getPresignedPutUrl(
    templateId: string,
    fileName: string,
    contentType?: string,
  ): Promise<PresignedPutResult> {
    // Sanitize fileName to avoid path traversal; use a simple key structure
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
    const key = `templates/${templateId}/${Date.now()}-${safeName}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ...(contentType && { ContentType: contentType }),
    });
    const url = await getSignedUrl(this.client, command, {
      expiresIn: PRESIGN_EXPIRES_IN_SEC,
    });
    return { url, key };
  }

  async deleteObject(key: string): Promise<void> {
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
