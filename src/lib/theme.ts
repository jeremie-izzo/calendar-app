export interface ThemeSetting {
    color: string  // hex
    opacity: number // 0–1
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
}

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
}

export const THEME_LABELS: Record<keyof ThemeConfig, string> = {
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
    const result = {...DEFAULT_THEME}
    for (const key of Object.keys(DEFAULT_THEME) as (keyof ThemeConfig)[]) {
        if (stored[key] && typeof stored[key] === 'object') {
            result[key] = {...DEFAULT_THEME[key], ...stored[key]}
        }
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
}

