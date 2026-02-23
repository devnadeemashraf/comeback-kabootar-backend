export const INFRASTRUCTURE_TOKENS = {
  Knex: Symbol.for('Knex'),
  Logger: Symbol.for('Logger'),
  TransactionRunner: Symbol.for('TransactionRunner'),
  GoogleOAuthClient: Symbol.for('GoogleOAuthClient'),
  TemplateStorageFacade: Symbol.for('TemplateStorageFacade'),
} as const;
