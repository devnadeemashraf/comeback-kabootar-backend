import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "templates" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "author_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "title" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "body" TEXT NOT NULL,
        "attachments" JSONB NULL,
        "is_public" BOOLEAN NOT NULL DEFAULT FALSE,
        "fork_count" INTEGER NOT NULL DEFAULT 0,
        "star_count" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);

  await knex.raw(`CREATE INDEX IF NOT EXISTS "idx_templates_public" ON "templates"("is_public");`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP INDEX IF NOT EXISTS "idx_templates_public";`);
  await knex.raw(`DROP TABLE IF EXISTS "templates" CASCADE;`);
}
