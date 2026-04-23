import { createServerFn } from '@tanstack/react-start'
import sql, { initDb } from '../lib/db'
import type { ThemeConfig } from '../lib/theme'
import type { ColorRule } from '../lib/types'

export interface Settings {
  theme: ThemeConfig | null
  rules: ColorRule[] | null
  eventColors: Record<string, string> | null
}

export const getSettings = createServerFn({ method: 'GET' })
  .inputValidator((email: string) => email)
  .handler(async (ctx): Promise<Settings> => {
    await initDb()
    const rows = await sql<{ theme: ThemeConfig; rules: ColorRule[]; event_colors: Record<string, string> }[]>`
      SELECT theme, rules, event_colors FROM user_settings WHERE email = ${ctx.data}
    `
    const row = rows[0]
    return {
      theme: row?.theme ?? null,
      rules: row?.rules ?? null,
      eventColors: row?.event_colors ?? null,
    }
  })

export const saveSettings = createServerFn({ method: 'POST' })
  .inputValidator((data: {
    email: string
    theme?: ThemeConfig
    rules?: ColorRule[]
    eventColors?: Record<string, string>
  }) => data)
  .handler(async (ctx) => {
    await initDb()
    const { email, theme, rules, eventColors } = ctx.data
    const themeParam = theme ?? null
    const rulesParam = rules ?? null
    const eventColorsParam = eventColors ?? null
    await sql`
      INSERT INTO user_settings (email, theme, rules, event_colors)
        VALUES (${email}, ${themeParam}::jsonb, ${rulesParam}::jsonb, ${eventColorsParam}::jsonb)
      ON CONFLICT (email) DO UPDATE SET
        theme        = COALESCE(EXCLUDED.theme,        user_settings.theme),
        rules        = COALESCE(EXCLUDED.rules,        user_settings.rules),
        event_colors = COALESCE(EXCLUDED.event_colors, user_settings.event_colors),
        updated_at   = NOW()
    `
  })
