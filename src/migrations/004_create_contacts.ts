import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "contacts" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" UUID NOT NULL REFERENCES "companies"("id") ON DELETE RESTRICT,
        "contributed_by_user_id" UUID NULL REFERENCES "users"("id") ON DELETE SET NULL,
        "email" TEXT UNIQUE NOT NULL,
        "linkedin_url" TEXT NULL,
        "designation" TEXT NOT NULL,
        "region" TEXT NOT NULL,
        "country" TEXT NOT NULL,
        "status" verification_status NOT NULL DEFAULT 'UNVERIFIED',
        "created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE IF EXISTS "contacts" CASCADE;`);
}
