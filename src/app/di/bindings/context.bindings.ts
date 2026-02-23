import type { DependencyContainer } from 'tsyringe';

import { RepositoryContext } from '@/app/context/RepositoryContext';
import { ServiceContext } from '@/app/context/ServiceContext';
import { CONTEXT_TOKENS } from '@/app/di/tokens/context.tokens';

export function registerContextBindings(container: DependencyContainer): void {
  container.registerSingleton(CONTEXT_TOKENS.RepositoryContext, RepositoryContext);
  container.registerSingleton(CONTEXT_TOKENS.ServiceContext, ServiceContext);
}
