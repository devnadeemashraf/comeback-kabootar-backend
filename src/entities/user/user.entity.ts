import type { EmailAddress } from '@/shared/types/entities';

export interface User {
  id: string;
  email: EmailAddress;
  isPremium: boolean;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserRow {
  id: string;
  email: EmailAddress;
  is_premium: boolean;
  credits: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
