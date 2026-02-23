import { DependencyContainer } from 'tsyringe';

import { REPOSITORY_TOKENS } from '../tokens/repository.tokens';

import { OAuthCredentialRepositoryPostgres } from '@/infrastructure/db/repositories/pg/oauth-credential.repo.pg';
import { UserRepositoryPostgres } from '@/infrastructure/db/repositories/pg/user.repo.pg';
import { RepositoryContext } from '@/infrastructure/db/repositories/repository.context';

export function registerRepositoryBindings(container: DependencyContainer): void {
  container.registerSingleton(REPOSITORY_TOKENS.RepositoryContext, RepositoryContext);
  container.registerSingleton(REPOSITORY_TOKENS.UserRepositoryPostgres, UserRepositoryPostgres);
  container.registerSingleton(
    REPOSITORY_TOKENS.OAuthCredentialRepositoryPostgres,
    OAuthCredentialRepositoryPostgres,
  );
}
