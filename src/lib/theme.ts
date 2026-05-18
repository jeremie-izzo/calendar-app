export interface ThemeSetting {
    color: string  // hex
    opacity: number // 0–1
}

export const CALENDAR_VIEWS = ['dayGridMonth', 'dayGridTwoWeek', 'timeGridWeek', 'timeGridDay'] as const
export type CalendarView = typeof CALENDAR_VIEWS[number]

export const CALENDAR_VIEW_LABELS: Record<CalendarView, string> = {
    dayGridMonth: 'Month',
    dayGridTwoWeek: '2 weeks',
    timeGridWeek: 'Week',
    timeGridDay: 'Day',
}

export interface ThemeConfig {
    pageBg: ThemeSetting
    surfaceBg: ThemeSetting
    topbarBg: ThemeSetting
    borderColor: ThemeSetting
    textPrimary: ThemeSetting
    textSecondary: ThemeSetting
    accentColor: ThemeSetting
    defaultEventColor: ThemeSetting
    todayBg: ThemeSetting
    eventSize: number  // multiplier, 1 = default
    defaultView: CalendarView
}

export type ThemeColorKey = keyof Omit<ThemeConfig, 'eventSize' | 'defaultView'>

export const DEFAULT_THEME: ThemeConfig = {
    pageBg: {color: '#f3f4f6', opacity: 1},
    surfaceBg: {color: '#ffffff', opacity: 1},
    topbarBg: {color: '#ffffff', opacity: 1},
    borderColor: {color: '#e5e7eb', opacity: 1},
    textPrimary: {color: '#173a40', opacity: 1},
    textSecondary: {color: '#6b7280', opacity: 1},
    accentColor: {color: '#328f97', opacity: 1},
    defaultEventColor: {color: '#328f97', opacity: 1},
    todayBg: {color: '#4fb8b2', opacity: 0.08},
    eventSize: 1,
    defaultView: 'dayGridMonth',
}

export const THEME_LABELS: Record<ThemeColorKey, string> = {
    pageBg: 'Page background',
    surfaceBg: 'Calendar background',
    topbarBg: 'Top bar background',
    borderColor: 'Borders',
    textPrimary: 'Primary text',
    textSecondary: 'Secondary text',
    accentColor: 'Accent color',
    defaultEventColor: 'Default event color',
    todayBg: 'Today highlight',
}

export function toRgba(color: string, opacity: number): string {
    // Already rgba/rgb — pass through
    if (color.startsWith('rgb')) return color

    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return opacity === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${opacity})`
}

export function mergeTheme(stored: Partial<ThemeConfig>): ThemeConfig {
    const result: ThemeConfig = {...DEFAULT_THEME}
    for (const key of Object.keys(THEME_LABELS) as ThemeColorKey[]) {
        const value = stored[key]
        if (value && typeof value === 'object') {
            result[key] = {...DEFAULT_THEME[key], ...value}
        }
    }
    if (typeof stored.eventSize === 'number' && Number.isFinite(stored.eventSize)) {
        result.eventSize = stored.eventSize
    }
    if (typeof stored.defaultView === 'string' && (CALENDAR_VIEWS as readonly string[]).includes(stored.defaultView)) {
        result.defaultView = stored.defaultView as CalendarView
    }
    return result
}

export function applyTheme(raw: Partial<ThemeConfig>) {
    const theme = mergeTheme(raw)
    const root = document.documentElement
    const set = (varName: string, s: ThemeSetting) =>
        root.style.setProperty(varName, toRgba(s.color, s.opacity))

    set('--theme-bg', theme.pageBg)
    set('--theme-surface', theme.surfaceBg)
    set('--theme-topbar', theme.topbarBg)
    set('--theme-border', theme.borderColor)
    set('--theme-text', theme.textPrimary)
    set('--theme-text-soft', theme.textSecondary)
    set('--theme-event', theme.accentColor)
    root.style.setProperty('--theme-default-event', theme.defaultEventColor.color)
    set('--theme-today', theme.todayBg)
    root.style.setProperty('--event-scale', String(theme.eventSize))
}

