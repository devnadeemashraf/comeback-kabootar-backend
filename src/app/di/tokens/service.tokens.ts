const HEALTH_SERVICE_TOKENS = {
  GetHealthService: Symbol.for('GetHealthService'),
} as const;

const AUTHENTICATION_SERVICE_TOKENS = {
  GetCurrentUserService: Symbol.for('GetCurrentUserService'),
  InitiateGoogleAuthenticationService: Symbol.for('InitiateGoogleAuthenticationService'),
  HandleGoogleAuthenticationCallbackService: Symbol.for(
    'HandleGoogleAuthenticationCallbackService',
  ),
};

const TEMPLATES_SERVICE_TOKENS = {
  GetAllTemplatesService: Symbol.for('GetAllTemplatesService'),
  GetTemplateByIdService: Symbol.for('GetTemplateByIdService'),
  CreateTemplateService: Symbol.for('CreateTemplateService'),
  UpdateTemplateService: Symbol.for('UpdateTemplateService'),
  DeleteTemplateService: Symbol.for('DeleteTemplateService'),
  FinalizeTemplateService: Symbol.for('FinalizeTemplateService'),
  GetPresignedUploadUrlService: Symbol.for('GetPresignedUploadUrlService'),
  ReportAttachmentCompleteService: Symbol.for('ReportAttachmentCompleteService'),
  DeleteAttachmentService: Symbol.for('DeleteAttachmentService'),
};

export const SERVICE_TOKENS = {
  ...HEALTH_SERVICE_TOKENS,
  ...AUTHENTICATION_SERVICE_TOKENS,
  ...TEMPLATES_SERVICE_TOKENS,
} as const;
