import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/__tests__/jest.setup.ts'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@workers/(.*)$': '<rootDir>/src/workers/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/__tests__/**', '!src/scripts/**', '!src/server.ts'],
  forceExit: true,
  detectOpenHandles: true,
};

export default config;
