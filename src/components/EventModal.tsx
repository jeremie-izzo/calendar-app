import type { EventClickArg } from '@fullcalendar/core'
import type { ColorRule, CalendarEventExtended } from '../lib/types'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
]

interface EventModalProps {
  event: EventClickArg | null
  rules: ColorRule[]
  eventColors: Record<string, string>
  onColorChange: (eventId: string, color: string | null) => void
  onClose: () => void
}

export function EventModal({ event, rules, eventColors, onColorChange, onClose }: EventModalProps) {
  if (!event) return null

  const { id, title, start, end, extendedProps, backgroundColor } = event.event
  const props = extendedProps as CalendarEventExtended
  const attendees: string[] = props.attendees ?? []
  const eventId = id ?? ''
  const override = eventId ? eventColors[eventId] : undefined

  const fmt = (d: Date | null) =>
    d?.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) ?? ''

  const matchedRules = rules.filter((r) =>
    attendees.some((a) => a.toLowerCase() === r.attendeeEmail.toLowerCase())
  )

  const activeColor = backgroundColor ?? 'var(--theme-default-event, #328f97)'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-xl"
        style={{
          background: 'var(--theme-surface, #ffffff)',
          border: '1px solid var(--theme-border, #e5e7eb)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color bar */}
        <div
          className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl"
          style={{ backgroundColor: activeColor }}
        />

        {/* Title + close */}
        <div className="mb-4 flex items-start justify-between gap-3 pl-2">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--theme-text, #173a40)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1 transition hover:opacity-60"
            style={{ color: 'var(--theme-text-soft, #6b7280)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.854 3.146a.5.5 0 0 1 0 .708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293l4.146-4.147a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
        </div>

        <div className="space-y-3 pl-2 text-sm" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
          {/* Time */}
          <div className="flex items-start gap-2">
            <span className="mt-0.5">🕐</span>
            <div>
              <div>{fmt(start)}</div>
              {end && <div>→ {fmt(end)}</div>}
            </div>
          </div>

          {/* Location */}
          {props.location && (
            <div className="flex items-start gap-2">
              <span className="mt-0.5">📍</span>
              <span>{props.location}</span>
            </div>
          )}

          {/* Description */}
          {props.description && (
            <div className="flex items-start gap-2">
              <span className="mt-0.5">📝</span>
              <span className="line-clamp-3" dangerouslySetInnerHTML={{ __html: props.description }} />
            </div>
          )}

          {/* Attendees */}
          {attendees.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="mt-0.5">👥</span>
              <div className="flex flex-wrap gap-1.5">
                {attendees.map((email) => {
                  const rule = rules.find(
                    (r) => r.attendeeEmail.toLowerCase() === email.toLowerCase()
                  )
                  return (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs"
                      style={{
                        borderColor: 'var(--theme-border, #e5e7eb)',
                        color: 'var(--theme-text, #173a40)',
                      }}
                    >
                      {rule && (
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: rule.color }} />
                      )}
                      {email}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Matched rules */}
          {matchedRules.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {matchedRules.map((r) => (
                <span
                  key={r.id}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: r.color }}
                >
                  {r.label}
                </span>
              ))}
            </div>
          )}

          {/* Event color override */}
          {eventId && (
            <div
              className="mt-1 rounded-xl border p-3"
              style={{ borderColor: 'var(--theme-border, #e5e7eb)' }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--theme-text, #173a40)' }}>
                  Event color
                </span>
                {override && (
                  <button
                    onClick={() => onColorChange(eventId, null)}
                    className="text-xs transition hover:underline"
                    style={{ color: 'var(--theme-text-soft, #6b7280)' }}
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => onColorChange(eventId, c)}
                    className="h-6 w-6 rounded-full border-2 transition hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: override === c ? 'white' : 'transparent',
                      boxShadow: override === c ? `0 0 0 2px ${c}` : 'none',
                    }}
                  />
                ))}
                <label className="relative h-6 w-6 cursor-pointer" title="Custom color">
                  <span
                    className="block h-6 w-6 rounded-full border-2"
                    style={{
                      background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                      borderColor: override && !PRESET_COLORS.includes(override) ? 'white' : 'transparent',
                      boxShadow: override && !PRESET_COLORS.includes(override) ? `0 0 0 2px ${override}` : 'none',
                    }}
                  />
                  <input
                    type="color"
                    value={override ?? '#328f97'}
                    onChange={(e) => onColorChange(eventId, e.target.value)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Link */}
          {props.htmlLink && (
            <a
              href={props.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-xs hover:underline"
              style={{ color: 'var(--theme-event, #328f97)' }}
            >
              Open in Google Calendar ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
