import { useState, useEffect, useRef } from 'react'
import type { ColorRule } from '../lib/types'
import { authState } from '../lib/authState'
import { getSettings, saveSettings } from '../server/settings'

export function useColorRules() {
  const [rules, setRules] = useState<ColorRule[]>([])
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)

  // Load from DB once after auth
  useEffect(() => {
    const email = authState.email
    if (!email || initialized.current) return
    initialized.current = true
    getSettings({ data: email }).then((s) => {
      const loaded = Array.isArray(s.rules)
        ? s.rules.filter((r) => r && typeof r.color === 'string')
        : []
      setRules(loaded)
    })
  })

  // Save to DB on change (debounced)
  const save = (updated: ColorRule[]) => {
    const email = authState.email
    if (!email || !initialized.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveSettings({ data: { email, rules: updated } })
    }, 1000)
  }

  const addRule = (rule: Omit<ColorRule, 'id'>) => {
    const updated = [...rules, { ...rule, id: crypto.randomUUID() }]
    setRules(updated)
    save(updated)
  }

  const removeRule = (id: string) => {
    const updated = rules.filter((r) => r.id !== id)
    setRules(updated)
    save(updated)
  }

  const updateRule = (id: string, updates: Partial<Omit<ColorRule, 'id'>>) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, ...updates } : r))
    setRules(updated)
    save(updated)
  }

  return { rules, addRule, removeRule, updateRule }
}
