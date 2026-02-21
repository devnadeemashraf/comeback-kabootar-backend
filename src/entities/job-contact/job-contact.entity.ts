import type { JobContactStatus } from '@/shared/types/entities';

export interface JobContact {
  jobId: string;
  contactId: string;
  attemptCount: number;
  nextRunAt: Date;
  status: JobContactStatus;
}

export interface JobContactRow {
  job_id: string;
  contact_id: string;
  attempt_count: number;
  next_run_at: Date;
  status: JobContactStatus;
}
