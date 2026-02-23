export const REPOSITORY_TOKENS = {
  // Repositories Context -- Shared across all repositories
  RepositoryContext: Symbol.for('RepositoryContext'),
  // Repositories
  UserRepositoryPostgres: Symbol.for('UserRepositoryPostgres'),
  OAuthCredentialRepositoryPostgres: Symbol.for('OAuthCredentialRepositoryPostgres'),
} as const;
