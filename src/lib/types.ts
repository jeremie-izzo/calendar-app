export interface ColorRule {
  id: string
  label: string
  attendeeEmail: string
  color: string
}

export interface CalendarEventExtended {
  attendees: string[]
  description?: string
  location?: string
  htmlLink?: string
}
