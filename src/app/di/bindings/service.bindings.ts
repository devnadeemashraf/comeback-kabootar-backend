import type { DependencyContainer } from 'tsyringe';

import { SERVICE_TOKENS } from '@/app/di/tokens/service.tokens';
import { GetCurrentUserService } from '@/features/authentication/service/get-current-user.service';
import { HandleGoogleAuthenticationCallbackService } from '@/features/authentication/service/handle-google-callback.service';
import { InitiateGoogleAuthenticationService } from '@/features/authentication/service/initiate-google-auth.service';
import { GetHealthService } from '@/features/health/service/get-health.service';

export function registerServiceBindings(container: DependencyContainer): void {
  container.registerSingleton(SERVICE_TOKENS.GetHealthService, GetHealthService);
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
