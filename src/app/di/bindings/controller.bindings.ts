import type { DependencyContainer } from 'tsyringe';

import { CONTROLLER_TOKENS } from '@/app/di/tokens/controller.tokens';
import { OAuthController } from '@/features/authentication/api/auth.controller';
import { HealthController } from '@/features/health/api/health.controller';
import { TemplateController } from '@/features/template/api/template.controller';

export function registerControllerBindings(container: DependencyContainer): void {
  container.registerSingleton(CONTROLLER_TOKENS.HealthController, HealthController);
  container.registerSingleton(CONTROLLER_TOKENS.OAuthController, OAuthController);
  container.registerSingleton(CONTROLLER_TOKENS.TemplateController, TemplateController);
}
