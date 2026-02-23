import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "templates"
    ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ready'
    CHECK ("status" IN ('draft', 'ready'));
  `);
  // Existing rows default to 'ready'; new rows will use default 'draft' at insert time via app
  await knex.raw(`
    ALTER TABLE "templates"
    ALTER COLUMN "status" SET DEFAULT 'draft';
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE "templates" DROP COLUMN IF EXISTS "status";`);
}
