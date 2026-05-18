import type { EventContentArg } from '@fullcalendar/core'

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function makeEventContent(defaultColor: string) {
  return function renderEventContent(arg: EventContentArg) {
    const color = arg.event.backgroundColor?.startsWith('#')
      ? arg.event.backgroundColor
      : defaultColor

    const bg = hexToRgba(color, 0.12)

    return (
      <div
        className="w-full overflow-hidden rounded"
        style={{
          backgroundColor: bg,
          borderLeft: `3px solid ${color}`,
          color,
          padding: 'calc(0.125rem * var(--event-scale, 1)) calc(0.375rem * var(--event-scale, 1))',
        }}
      >
        <span
          className="block truncate font-semibold leading-snug"
          style={{ fontSize: 'calc(0.75rem * var(--event-scale, 1))' }}
        >
          {arg.timeText && (
            <span className="mr-1 font-normal opacity-75">{arg.timeText}</span>
          )}
          {arg.event.title}
        </span>
      </div>
    )
  }
}
