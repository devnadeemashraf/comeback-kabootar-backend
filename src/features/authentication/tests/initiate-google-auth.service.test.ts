jest.mock('@/config/app', () => ({
  config: {
    oauth: { google: { redirectUri: 'http://localhost:3000/api/v1/auth/google/callback' } },
  },
}));

import { InitiateGoogleAuthenticationService } from '../service/initiate-google-auth.service';

describe('InitiateGoogleAuthenticationService', () => {
  const mockGetAuthUrl = jest.fn();
  const mockGoogleOAuthClient = { getAuthUrl: mockGetAuthUrl };

  beforeEach(() => {
    mockGetAuthUrl.mockClear();
  });

  it('returns url and state; URL contains redirect_uri and state', () => {
    mockGetAuthUrl.mockImplementation((redirectUri: string, state: string) => {
      return `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    });

    const service = new InitiateGoogleAuthenticationService(mockGoogleOAuthClient as any);
    const result = service.execute();

    expect(result.state).toMatch(/^[a-f0-9]{64}$/);
    expect(result.url).toContain(result.state);
    expect(mockGetAuthUrl).toHaveBeenCalledWith(expect.any(String), result.state);
  });

  it('generates a new random state on each call', () => {
    mockGetAuthUrl.mockImplementation(
      (_redirectUri: string, state: string) => `https://example.com?state=${state}`,
    );

    const service = new InitiateGoogleAuthenticationService(mockGoogleOAuthClient as any);
    const a = service.execute();
    const b = service.execute();

    expect(a.state).not.toBe(b.state);
  });
});
