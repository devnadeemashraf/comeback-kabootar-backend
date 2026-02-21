import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "jobs" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "template_id" UUID NOT NULL REFERENCES "templates"("id") ON DELETE RESTRICT,
        "credential_id" UUID NOT NULL REFERENCES "oauth_credentials"("id") ON DELETE RESTRICT,
        "frequency" frequency_type NOT NULL,
        "max_follow_ups" INTEGER NOT NULL DEFAULT 3,
        "is_active" BOOLEAN NOT NULL DEFAULT FALSE,
        "created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);

  await knex.raw(`CREATE INDEX IF NOT EXISTS "idx_jobs_active" ON "jobs"("is_active");`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP INDEX IF NOT EXISTS "idx_jobs_active";`);
  await knex.raw(`DROP TABLE IF EXISTS "jobs" CASCADE;`);
}
