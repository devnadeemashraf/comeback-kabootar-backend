import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "companies" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "contributed_by_user_id" UUID NULL REFERENCES "users"("id") ON DELETE SET NULL,
        "name" TEXT UNIQUE NOT NULL,
        "created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE IF EXISTS "companies" CASCADE;`);
}
