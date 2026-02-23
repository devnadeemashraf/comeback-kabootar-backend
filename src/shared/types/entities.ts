/** OAuth provider identifier. */
export type ProviderType = 'GOOGLE' | 'MICROSOFT';
/** Contact verification outcome. */
export type VerificationStatus = 'VERIFIED' | 'STALE' | 'PARTIAL' | 'UNVERIFIED';
/** Job follow-up frequency. */
export type FrequencyType = 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY';
/** Job-contact delivery status. */
export type JobContactStatus = 'PENDING' | 'COMPLETED' | 'PAUSED' | 'FAILED';

/** Branded string for email; use after validation. */
export type EmailAddress = string & { readonly __brand: unique symbol };
/** Branded string for LinkedIn URL. */
export type LinkedInUrl = string & { readonly __brand: unique symbol };
