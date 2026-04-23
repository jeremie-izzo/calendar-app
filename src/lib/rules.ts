import type { EventInput } from '@fullcalendar/core'
import type { ColorRule } from './types'

export function applyEventColors(events: EventInput[], eventColors: Record<string, string>): EventInput[] {
  if (Object.keys(eventColors).length === 0) return events
  return events.map((event) => {
    const override = event.id ? eventColors[String(event.id)] : undefined
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
