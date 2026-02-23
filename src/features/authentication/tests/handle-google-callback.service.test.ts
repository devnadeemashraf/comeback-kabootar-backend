import { HandleGoogleAuthenticationCallbackService } from '../service/handle-google-callback.service';

jest.mock('@/config/app', () => ({
  config: {
    oauth: { google: { redirectUri: 'http://localhost:3000/api/v1/auth/google/callback' } },
    auth: { jwtSecret: 'test-secret', jwtExpiry: '7d' },
  },
}));

const mockSignJwt = jest.fn();
jest.mock('@/shared/jwt', () => ({ signJwt: (...args: unknown[]) => mockSignJwt(...args) }));

describe('HandleGoogleAuthenticationCallbackService', () => {
  const mockExchangeCodeForTokens = jest.fn();
  const mockGetUserInfo = jest.fn();
  const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const mockOAuthCredentialRepo = {
    findByUserIdAndProvider: jest.fn(),
    save: jest.fn(),
    updateTokens: jest.fn(),
  };
  const mockTransactionRunner = {
    run: jest.fn((fn: (tx: unknown) => Promise<unknown>) => fn(null)),
  };

  const mockGoogleOAuthClient = {
    exchangeCodeForTokens: mockExchangeCodeForTokens,
    getUserInfo: mockGetUserInfo,
  };

  const service = new HandleGoogleAuthenticationCallbackService(
    mockGoogleOAuthClient as any,
    mockUserRepo as any,
    mockOAuthCredentialRepo as any,
    mockTransactionRunner as any,
  );

  const validUser = {
    id: 'user-1',
    email: 'test@example.com',
    isPremium: false,
    credits: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSignJwt.mockResolvedValue('mock-jwt');
    mockExchangeCodeForTokens.mockResolvedValue({
      accessToken: 'at',
      refreshToken: 'rt',
      expiresAt: new Date(),
    });
    mockGetUserInfo.mockResolvedValue({ email: 'test@example.com' });
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.create.mockResolvedValue(validUser);
    mockOAuthCredentialRepo.findByUserIdAndProvider.mockResolvedValue(null);
    mockOAuthCredentialRepo.save.mockResolvedValue({});
  });

  it('throws UnauthorizedError when state is missing', async () => {
    await expect(
      service.execute({
        code: 'code',
        state: 'state',
        stateFromCookie: null,
      }),
    ).rejects.toMatchObject(
      expect.objectContaining({ name: 'UnauthorizedError', code: 'INVALID_STATE' }),
    );
  });

  it('throws UnauthorizedError when state does not match cookie', async () => {
    await expect(
      service.execute({
        code: 'code',
        state: 'state-a',
        stateFromCookie: 'state-b',
      }),
    ).rejects.toMatchObject(
      expect.objectContaining({ name: 'UnauthorizedError', code: 'INVALID_STATE' }),
    );
  });

  it('throws UnauthorizedError when token exchange fails', async () => {
    mockExchangeCodeForTokens.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      service.execute({
        code: 'bad-code',
        state: 's',
        stateFromCookie: 's',
      }),
    ).rejects.toMatchObject(
      expect.objectContaining({ name: 'UnauthorizedError', code: 'TOKEN_EXCHANGE_FAILED' }),
    );
  });

  it('throws ValidationError when user info has no email', async () => {
    mockGetUserInfo.mockResolvedValueOnce({ email: '' });

    await expect(
      service.execute({
        code: 'code',
        state: 's',
        stateFromCookie: 's',
      }),
    ).rejects.toMatchObject(
      expect.objectContaining({ name: 'ValidationError', code: 'MISSING_EMAIL' }),
    );
  });

  it('returns jwt and user when state is valid and user is created', async () => {
    const result = await service.execute({
      code: 'code',
      state: 's',
      stateFromCookie: 's',
    });

    expect(result.jwt).toBe('mock-jwt');
    expect(result.user).toEqual({ id: 'user-1', email: 'test@example.com' });
    expect(mockTransactionRunner.run).toHaveBeenCalled();
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com', null);
    expect(mockUserRepo.create).toHaveBeenCalledWith({ email: 'test@example.com' }, null);
    expect(mockOAuthCredentialRepo.save).toHaveBeenCalled();
  });

  it('uses existing user and updates credential when user already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValueOnce(validUser);
    mockOAuthCredentialRepo.findByUserIdAndProvider.mockResolvedValueOnce({
      id: 'cred-1',
      userId: 'user-1',
      provider: 'GOOGLE',
      connectedEmail: 'test@example.com',
      accessToken: 'old',
      refreshToken: 'old',
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.execute({
      code: 'code',
      state: 's',
      stateFromCookie: 's',
    });

    expect(result.user).toEqual({ id: 'user-1', email: 'test@example.com' });
    expect(mockUserRepo.create).not.toHaveBeenCalled();
    expect(mockOAuthCredentialRepo.updateTokens).toHaveBeenCalledWith(
      'cred-1',
      'at',
      'rt',
      expect.any(Date),
      null,
    );
  });
});
