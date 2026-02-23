const HEALTH_SERVICE_TOKENS = {
  GetHealthService: Symbol.for('GetHealthService'),
  GetCurrentUserService: Symbol.for('GetCurrentUserService'),
  InitiateGoogleAuthenticationService: Symbol.for('InitiateGoogleAuthenticationService'),
  HandleGoogleAuthenticationCallbackService: Symbol.for(
    'HandleGoogleAuthenticationCallbackService',
  ),
} as const;

export const SERVICE_TOKENS = {
  ...HEALTH_SERVICE_TOKENS,
} as const;
