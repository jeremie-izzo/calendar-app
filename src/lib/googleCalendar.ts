import type { EventInput } from '@fullcalendar/core'

interface GoogleAttendee {
  email: string
  displayName?: string
}

interface GoogleEvent {
  id: string
  summary?: string
  description?: string
  location?: string
  htmlLink?: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  attendees?: GoogleAttendee[]
}

export async function fetchCalendarEvents(accessToken: string): Promise<EventInput[]> {
  const now = new Date()
  const timeMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const timeMax = new Date(now.getFullYear(), now.getMonth() + 3, 1).toISOString()

  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '500',
  })

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `Google Calendar API error ${res.status}`)
  }

  const data = await res.json()
  return (data.items as GoogleEvent[]).map((item) => ({
    id: item.id,
    title: item.summary ?? '(No title)',
    start: item.start.dateTime ?? item.start.date,
    end: item.end.dateTime ?? item.end.date,
    extendedProps: {
      attendees: item.attendees?.map((a) => a.email) ?? [],
      description: item.description,
      location: item.location,
      htmlLink: item.htmlLink,
    },
  }))
}
