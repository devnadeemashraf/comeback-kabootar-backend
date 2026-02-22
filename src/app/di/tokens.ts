export const DI_TOKENS = {
  // Infrastructure
  Knex: Symbol.for('Knex'),
  Logger: Symbol.for('Logger'),
  TransactionRunner: Symbol.for('TransactionRunner'),
} as const;
