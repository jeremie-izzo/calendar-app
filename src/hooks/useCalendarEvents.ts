import { useState, useEffect, useMemo } from 'react'
import type { EventInput } from '@fullcalendar/core'
import { fetchCalendarEvents } from '../lib/googleCalendar'
import { applyRules, applyEventColors } from '../lib/rules'
import type { ColorRule } from '../lib/types'

export function useCalendarEvents(
  accessToken: string | null,
  rules: ColorRule[],
  eventColors: Record<string, string>,
) {
  const [rawEvents, setRawEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setRawEvents([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchCalendarEvents(accessToken)
      .then((raw) => { if (!cancelled) setRawEvents(raw) })
      .catch((err: Error) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [accessToken])

  const events = useMemo(
    () => applyEventColors(applyRules(rawEvents, rules), eventColors),
    [rawEvents, rules, eventColors],
  )

  return { events, loading, error }
}
