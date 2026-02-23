/** Result of requesting a presigned PUT URL for template attachment upload. */
export interface PresignedPutResult {
  url: string;
  key: string;
}

/** Facade for template attachment storage (MinIO/S3). Backend never receives file bytes; client uploads via presigned URL. */
export interface TemplateStorageFacade {
  /** Generate a presigned PUT URL for the client to upload directly. Key is returned so backend can record it on completion. */
  getPresignedPutUrl(
    templateId: string,
    fileName: string,
    contentType?: string,
  ): Promise<PresignedPutResult>;

  /** Optional: delete object by key (e.g. when user removes an attachment). */
  deleteObject(key: string): Promise<void>;
}
