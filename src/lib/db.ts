import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL!, { idle_timeout: 20 })

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_settings (
      email        TEXT PRIMARY KEY,
      theme        JSONB,
      rules        JSONB,
      event_colors JSONB,
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS event_colors JSONB`
}

export default sql
