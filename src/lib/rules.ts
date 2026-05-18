import type { EventInput } from '@fullcalendar/core'
import type { ColorRule } from './types'

export function colorKeyForEvent(id: string | undefined, recurringEventId: string | undefined): string | undefined {
  return recurringEventId ?? (id ? String(id) : undefined)
}

export function applyEventColors(events: EventInput[], eventColors: Record<string, string>): EventInput[] {
  if (Object.keys(eventColors).length === 0) return events
  return events.map((event) => {
    const recurringEventId = (event.extendedProps?.recurringEventId as string | undefined) ?? undefined
    const key = colorKeyForEvent(event.id ? String(event.id) : undefined, recurringEventId)
    const override = key ? eventColors[key] : undefined
    if (!override) return event
    return { ...event, backgroundColor: override, borderColor: override }
  })
}

export function applyRules(events: EventInput[], rules: ColorRule[]): EventInput[] {
  if (!Array.isArray(rules) || rules.length === 0) return events
  return events.map((event) => {
    const attendees: string[] = (event.extendedProps?.attendees as string[]) ?? []
    const matched = rules.find((rule) =>
      attendees.some((email) => email.toLowerCase() === rule.attendeeEmail.toLowerCase())
    )
    if (!matched) {
      const { backgroundColor: _bg, borderColor: _bc, ...rest } = event as EventInput & { backgroundColor?: string; borderColor?: string }
      return rest
    }
    return { ...event, backgroundColor: matched.color, borderColor: matched.color }
  })
}
