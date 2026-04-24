import { useState, useEffect, useRef, useMemo } from 'react'
import type { EventInput } from '@fullcalendar/core'
import { fetchCalendarEvents } from '../lib/googleCalendar'
import { applyRules, applyEventColors } from '../lib/rules'
import type { ColorRule } from '../lib/types'

// 15 minutes — 96 calls/day, safely under Google's 1 M quota-unit/day free tier
const DEFAULT_POLL_INTERVAL_MS = 15 * 60 * 1000

export function useCalendarEvents(
  accessToken: string | null,
  rules: ColorRule[],
  eventColors: Record<string, string>,
  pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
) {
  const [rawEvents, setRawEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const tokenRef = useRef(accessToken)
  tokenRef.current = accessToken

  useEffect(() => {
    if (!accessToken) {
      setRawEvents([])
      return
    }

    let cancelled = false

    const doFetch = (isFirstFetch: boolean) => {
      if (isFirstFetch) setLoading(true)
      setError(null)
      fetchCalendarEvents(tokenRef.current!)
        .then((raw) => { if (!cancelled) setRawEvents(raw) })
        .catch((err: Error) => { if (!cancelled) setError(err.message) })
        .finally(() => { if (!cancelled && isFirstFetch) setLoading(false) })
    }

    doFetch(true)
    const intervalId = setInterval(() => doFetch(false), pollIntervalMs)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [accessToken, pollIntervalMs])

  const events = useMemo(
    () => applyEventColors(applyRules(rawEvents, rules), eventColors),
    [rawEvents, rules, eventColors],
  )

  return { events, loading, error }
}
