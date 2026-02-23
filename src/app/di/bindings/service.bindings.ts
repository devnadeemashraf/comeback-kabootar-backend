import type { DependencyContainer } from 'tsyringe';

import { SERVICE_TOKENS, TEMPLATE_EVENT_BUS_TOKEN } from '@/app/di/tokens/service.tokens';
import { GetCurrentUserService } from '@/features/authentication/service/get-current-user.service';
import { HandleGoogleAuthenticationCallbackService } from '@/features/authentication/service/handle-google-callback.service';
import { InitiateGoogleAuthenticationService } from '@/features/authentication/service/initiate-google-auth.service';
import { GetHealthService } from '@/features/health/service/get-health.service';
import { CreateTemplateService } from '@/features/template/services/create-template.service';
import { DeleteAttachmentService } from '@/features/template/services/delete-attachment.service';
import { DeleteTemplateService } from '@/features/template/services/delete-template.service';
import { FinalizeTemplateService } from '@/features/template/services/finalize-template.service';
import { GetAllTemplatesService } from '@/features/template/services/get-all-templates.service';
import { GetPresignedUploadUrlService } from '@/features/template/services/get-presigned-upload-url.service';
import { GetTemplateByIdService } from '@/features/template/services/get-template-by-id.service';
import { ReportAttachmentCompleteService } from '@/features/template/services/report-attachment-complete.service';
import { ReportUploadProgressService } from '@/features/template/services/report-upload-progress.service';
import { UpdateTemplateService } from '@/features/template/services/update-template.service';
import { TemplateEventBus } from '@/features/template/template-event-bus';

function registerHealthServiceBindings(container: DependencyContainer): void {
  container.registerSingleton(SERVICE_TOKENS.GetHealthService, GetHealthService);
}

function registerAuthenticationServiceBindings(container: DependencyContainer): void {
  container.registerSingleton(SERVICE_TOKENS.GetCurrentUserService, GetCurrentUserService);
  container.registerSingleton(
    SERVICE_TOKENS.InitiateGoogleAuthenticationService,
    InitiateGoogleAuthenticationService,
  );
  container.registerSingleton(
    SERVICE_TOKENS.HandleGoogleAuthenticationCallbackService,
    HandleGoogleAuthenticationCallbackService,
  );
}

function registerTemplateServiceBindings(container: DependencyContainer): void {
  container.registerSingleton(TEMPLATE_EVENT_BUS_TOKEN, TemplateEventBus);
  container.registerSingleton(SERVICE_TOKENS.GetAllTemplatesService, GetAllTemplatesService);
  container.registerSingleton(SERVICE_TOKENS.GetTemplateByIdService, GetTemplateByIdService);
  container.registerSingleton(SERVICE_TOKENS.CreateTemplateService, CreateTemplateService);
  container.registerSingleton(SERVICE_TOKENS.UpdateTemplateService, UpdateTemplateService);
  container.registerSingleton(SERVICE_TOKENS.DeleteTemplateService, DeleteTemplateService);
  container.registerSingleton(SERVICE_TOKENS.FinalizeTemplateService, FinalizeTemplateService);
  container.registerSingleton(
    SERVICE_TOKENS.GetPresignedUploadUrlService,
    GetPresignedUploadUrlService,
  );
  container.registerSingleton(
    SERVICE_TOKENS.ReportAttachmentCompleteService,
    ReportAttachmentCompleteService,
  );
  container.registerSingleton(
    SERVICE_TOKENS.ReportUploadProgressService,
    ReportUploadProgressService,
  );
  container.registerSingleton(SERVICE_TOKENS.DeleteAttachmentService, DeleteAttachmentService);
}

export function registerServiceBindings(container: DependencyContainer): void {
  registerHealthServiceBindings(container);
  registerAuthenticationServiceBindings(container);
  registerTemplateServiceBindings(container);
}
