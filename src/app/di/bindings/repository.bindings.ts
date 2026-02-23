import { DependencyContainer } from 'tsyringe';

import { REPOSITORY_TOKENS } from '../tokens/repository.tokens';

import { RepositoryContext } from '@/app/context/RepositoryContext';
import { OAuthCredentialRepositoryPostgres } from '@/infrastructure/db/repositories/pg/oauth-credential.repo.pg';
import { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';
import { UserRepositoryPostgres } from '@/infrastructure/db/repositories/pg/user.repo.pg';

export function registerRepositoryBindings(container: DependencyContainer): void {
  container.registerSingleton(REPOSITORY_TOKENS.RepositoryContext, RepositoryContext);
  container.registerSingleton(REPOSITORY_TOKENS.UserRepositoryPostgres, UserRepositoryPostgres);
  container.registerSingleton(
    REPOSITORY_TOKENS.OAuthCredentialRepositoryPostgres,
    OAuthCredentialRepositoryPostgres,
  );
  container.registerSingleton(
    REPOSITORY_TOKENS.TemplateRepositoryPostgres,
    TemplateRepositoryPostgres,
  );
}
