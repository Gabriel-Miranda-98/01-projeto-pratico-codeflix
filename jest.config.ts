/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  rootDir: './src',
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\..*spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./core/shared/infra/testing/expect-helpers.ts'],
};

export default config;
