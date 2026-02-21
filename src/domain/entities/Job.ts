import type { FrequencyType } from '@domain/types';

export interface Job {
  id: string;
  userId: string;
  templateId: string;
  credentialId: string;
  frequency: FrequencyType;
  maxFollowUps: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobRow {
  id: string;
  user_id: string;
  template_id: string;
  credential_id: string;
  frequency: FrequencyType;
  max_follow_ups: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
