import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { EventClickArg } from '@fullcalendar/core'
import { CalendarView } from '../components/CalendarView'
import { EventModal } from '../components/EventModal'
import { GoogleSignIn } from '../components/GoogleSignIn'
import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { useCalendarEvents } from '../hooks/useCalendarEvents'
import { useColorRules } from '../hooks/useColorRules'
import { useTheme } from '../hooks/useTheme'
import { useEventColors } from '../hooks/useEventColors'

export const Route = createFileRoute('/')({ component: CalendarPage })

function CalendarPage() {
  const { isAuthenticated, accessToken, userEmail, login, logout } = useGoogleAuth()
  const { theme } = useTheme()
  const { rules } = useColorRules()
  const { eventColors, setEventColor } = useEventColors()
  const { events, loading, error } = useCalendarEvents(accessToken, rules, eventColors)
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null)

  if (!isAuthenticated) {
    return <GoogleSignIn onLogin={login} />
  }

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden">
      {/* Top bar */}
      <div
        className="flex items-center justify-between border-b px-6 py-3"
        style={{
          background: 'var(--theme-topbar, #ffffff)',
          borderColor: 'var(--theme-border, #e5e7eb)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--theme-text, #173a40)' }}>
            Calendar
          </span>
          {loading && (
            <span className="text-xs animate-pulse" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
              Syncing…
            </span>
          )}
          {error && (
            <span className="text-xs text-red-500">{error}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="text-xs" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
              {userEmail}
            </span>
          )}
          <button
            onClick={logout}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-70"
            style={{
              borderColor: 'var(--theme-border, #e5e7eb)',
              color: 'var(--theme-text-soft, #6b7280)',
            }}
          >
            Sign out
          </button>
          <Link
            to="/settings"
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium no-underline transition hover:opacity-70"
            style={{
              borderColor: 'var(--theme-border, #e5e7eb)',
              color: 'var(--theme-text-soft, #6b7280)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
            Settings
          </Link>
        </div>
      </div>

      {/* Calendar */}
      <div className="min-w-0 flex-1 overflow-hidden p-4">
        <CalendarView
          events={events}
          onEventClick={(info) => setSelectedEvent(info)}
          defaultEventColor={theme.defaultEventColor.color}
        />
      </div>

      <EventModal
        event={selectedEvent}
        rules={rules}
        eventColors={eventColors}
        onColorChange={setEventColor}
        onClose={() => setSelectedEvent(null)}
      />
    </main>
  )
}
