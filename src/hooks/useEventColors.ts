import { useState, useEffect, useRef } from 'react'
import { authState } from '../lib/authState'
import { getSettings, saveSettings } from '../server/settings'

export function useEventColors() {
  const [eventColors, setEventColors] = useState<Record<string, string>>({})
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    const email = authState.email
    if (!email || initialized.current) return
    initialized.current = true
    getSettings({ data: email }).then((s) => {
      setEventColors(s.eventColors ?? {})
    })
  })

  const setEventColor = (eventId: string, color: string | null) => {
    const updated = { ...eventColors }
    if (color === null) delete updated[eventId]
    else updated[eventId] = color
    setEventColors(updated)
    const email = authState.email
    if (!email) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveSettings({ data: { email, eventColors: updated } })
    }, 500)
  }

  return { eventColors, setEventColor }
}
