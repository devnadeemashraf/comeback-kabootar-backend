export interface Company {
  id: string;
  contributedByUserId: string | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyRow {
  id: string;
  contributed_by_user_id: string | null;
  name: string;
  created_at: Date;
  updated_at: Date;
}
