import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "job_contacts" (
        "job_id" UUID NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
        "contact_id" UUID NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
        "attempt_count" INTEGER NOT NULL DEFAULT 0,
        "next_run_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL,
        "status" job_contact_status NOT NULL DEFAULT 'PENDING',
        PRIMARY KEY ("job_id", "contact_id")
    );
  `);

  await knex.raw(
    `CREATE INDEX IF NOT EXISTS "idx_job_contacts_worker" ON "job_contacts"("status", "next_run_at");`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP INDEX IF NOT EXISTS "idx_job_contacts_worker";`);
  await knex.raw(`DROP TABLE IF EXISTS "job_contacts" CASCADE;`);
}
