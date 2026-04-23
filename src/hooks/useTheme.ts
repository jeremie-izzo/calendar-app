import { useState, useEffect, useRef } from 'react'
import {
  type ThemeConfig,
  type ThemeSetting,
  applyTheme,
  mergeTheme,
  DEFAULT_THEME,
} from '../lib/theme'
import { authState } from '../lib/authState'
import { getSettings, saveSettings } from '../server/settings'

export function useTheme() {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)

  // Load from DB once after auth
  useEffect(() => {
    const email = authState.email
    if (!email || initialized.current) return
    initialized.current = true
    getSettings({ data: email }).then((s) => {
      const loaded = s.theme ? mergeTheme(s.theme) : DEFAULT_THEME
      setTheme(loaded)
      applyTheme(loaded)
    })
  })

  // Apply on every change
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const updateSetting = (key: keyof ThemeConfig, value: Partial<ThemeSetting>) => {
    const updated = { ...theme, [key]: { ...theme[key], ...value } }
    setTheme(updated)
    const email = authState.email
    if (!email) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveSettings({ data: { email, theme: updated } })
    }, 1000)
  }

  const reset = () => {
    setTheme(DEFAULT_THEME)
    const email = authState.email
    if (email) saveSettings({ data: { email, theme: DEFAULT_THEME } })
  }

  return { theme, updateSetting, reset }
}
