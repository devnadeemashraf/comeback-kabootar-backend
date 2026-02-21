export type ProviderType = 'GOOGLE' | 'MICROSOFT';
export type VerificationStatus = 'VERIFIED' | 'STALE' | 'PARTIAL' | 'UNVERIFIED';
export type FrequencyType = 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY';
export type JobContactStatus = 'PENDING' | 'COMPLETED' | 'PAUSED' | 'FAILED';

// Branded types for lightweight validation
export type EmailAddress = string & { readonly __brand: unique symbol };
export type LinkedInUrl = string & { readonly __brand: unique symbol };
