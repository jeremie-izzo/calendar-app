import { useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventInput, EventClickArg } from '@fullcalendar/core'
import { makeEventContent } from '../lib/eventContent'

interface CalendarViewProps {
  events: EventInput[]
  onEventClick: (info: EventClickArg) => void
  defaultEventColor: string
}

export function CalendarView({ events, onEventClick, defaultEventColor }: CalendarViewProps) {
  const eventContent = useMemo(() => makeEventContent(defaultEventColor), [defaultEventColor])

  return (
    <div className="fc-app h-full" style={{ background: 'var(--theme-surface, #ffffff)' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={onEventClick}
        eventContent={eventContent}
        height="100%"
        eventDisplay="block"
        dayMaxEvents={4}
        nowIndicator
      />
    </div>
  )
}
