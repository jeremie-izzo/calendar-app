import { useEffect, useMemo, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventInput, EventClickArg } from '@fullcalendar/core'
import { makeEventContent } from '../lib/eventContent'
import { CALENDAR_VIEWS, type CalendarView as CalendarViewName } from '../lib/theme'

interface CalendarViewProps {
  events: EventInput[]
  onEventClick: (info: EventClickArg) => void
  defaultEventColor: string
  defaultView: CalendarViewName
  onViewChange: (view: CalendarViewName) => void
}

export function CalendarView({ events, onEventClick, defaultEventColor, defaultView, onViewChange }: CalendarViewProps) {
  const eventContent = useMemo(() => makeEventContent(defaultEventColor), [defaultEventColor])
  const calendarRef = useRef<FullCalendar | null>(null)

  useEffect(() => {
    const api = calendarRef.current?.getApi()
    if (api && api.view.type !== defaultView) {
      api.changeView(defaultView)
    }
  }, [defaultView])

  return (
    <div className="fc-app h-full" style={{ background: 'var(--theme-surface, #ffffff)' }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={defaultView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridTwoWeek,timeGridWeek,timeGridDay',
        }}
        views={{
          dayGridTwoWeek: {
            type: 'dayGrid',
            duration: { weeks: 2 },
            buttonText: '2 weeks',
          },
        }}
        events={events}
        eventClick={onEventClick}
        eventContent={eventContent}
        datesSet={(info) => {
          const viewType = info.view.type
          if (viewType !== defaultView && (CALENDAR_VIEWS as readonly string[]).includes(viewType)) {
            onViewChange(viewType as CalendarViewName)
          }
        }}
        height="100%"
        eventDisplay="block"
        dayMaxEvents={4}
        fixedWeekCount={false}
        nowIndicator
      />
    </div>
  )
}
