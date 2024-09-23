module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src/__tests__'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
}
