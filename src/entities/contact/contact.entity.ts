import type { EmailAddress, LinkedInUrl, VerificationStatus } from '@/shared/types/entities';

export interface Contact {
  id: string;
  companyId: string;
  contributedByUserId: string | null;
  email: EmailAddress;
  linkedInUrl: LinkedInUrl | null;
  designation: string;
  region: string;
  country: string;
  status: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactRow {
  id: string;
  company_id: string;
  contributed_by_user_id: string | null;
  email: string;
  linkedin_url: string | null;
  designation: string;
  region: string;
  country: string;
  status: VerificationStatus;
  created_at: Date;
  updated_at: Date;
}
