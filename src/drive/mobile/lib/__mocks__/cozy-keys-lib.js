jest.mock('cozy-keys-lib', () => ({
  withVaultClient: jest.fn().mockReturnValue({}),
  useVaultClient: jest.fn()
}))
