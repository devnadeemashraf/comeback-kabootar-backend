import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE provider_type AS ENUM ('GOOGLE', 'MICROSOFT');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);

  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE verification_status AS ENUM ('VERIFIED', 'STALE', 'PARTIAL', 'UNVERIFIED');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);

  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE frequency_type AS ENUM ('WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'QUARTERLY');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);

  await knex.raw(`
    DO $$ BEGIN
      CREATE TYPE job_contact_status AS ENUM ('PENDING', 'COMPLETED', 'PAUSED', 'FAILED');
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "users" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" TEXT UNIQUE NOT NULL,
        "is_premium" BOOLEAN NOT NULL DEFAULT FALSE,
        "credits" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMP(0) WITH TIME ZONE NULL
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE IF EXISTS "users" CASCADE;`);
  await knex.raw(`DROP TYPE IF EXISTS job_contact_status;`);
  await knex.raw(`DROP TYPE IF EXISTS frequency_type;`);
  await knex.raw(`DROP TYPE IF EXISTS verification_status;`);
  await knex.raw(`DROP TYPE IF EXISTS provider_type;`);
}
