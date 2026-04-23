import { useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { EventInput } from '@fullcalendar/core'
import { makeEventContent } from '../lib/eventContent'

const today = new Date()
const d = (offsetDays: number, h: number) => {
    const dt = new Date(today)
    dt.setDate(dt.getDate() + offsetDays)
    dt.setHours(h, 0, 0, 0)
    return dt.toISOString()
}

const PREVIEW_EVENTS: EventInput[] = [
    {id: 'p1', title: '1:1 with Sarah', start: d(0, 10), end: d(0, 11)},
    {id: 'p2', title: 'Sprint Planning', start: d(1, 9), end: d(1, 11)},
    {id: 'p3', title: 'Design Review', start: d(3, 14), end: d(3, 15)},
    {id: 'p4', title: 'All Hands', start: d(5, 16), end: d(5, 17)},
    {id: 'p5', title: 'Focus time', start: d(7, 9), end: d(7, 12)},
]

interface CalendarPreviewProps {
    defaultEventColor: string
}

export function CalendarPreview({defaultEventColor}: CalendarPreviewProps) {
    const eventContent = useMemo(() => makeEventContent(defaultEventColor), [defaultEventColor])

    return (
        <div
            className="fc-app"
            style={{background: 'var(--theme-surface, #ffffff)'}}
        >
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{left: 'prev,next', center: 'title', right: ''}}
                events={PREVIEW_EVENTS}
                eventContent={eventContent}
                height="auto"
                eventDisplay="block"
                dayMaxEvents={2}
                editable={false}
                selectable={false}
            />
        </div>
    )
}
