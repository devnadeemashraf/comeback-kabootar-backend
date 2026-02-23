const HEALTH_CONTROLLER_TOKENS = {
  HealthController: Symbol.for('HealthController'),
  OAuthController: Symbol.for('OAuthController'),
} as const;

export const CONTROLLER_TOKENS = {
  ...HEALTH_CONTROLLER_TOKENS,
} as const;
