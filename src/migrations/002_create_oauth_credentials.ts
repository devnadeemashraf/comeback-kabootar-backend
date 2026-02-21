import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "oauth_credentials" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "provider" provider_type NOT NULL,
        "connected_email" TEXT NOT NULL,
        "access_token" TEXT NULL,
        "refresh_token" TEXT NULL,
        "expires_at" TIMESTAMP(0) WITH TIME ZONE NULL,
        "created_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE IF EXISTS "oauth_credentials" CASCADE;`);
}
