import {
  THEME_LABELS,
  DEFAULT_THEME,
  CALENDAR_VIEWS,
  CALENDAR_VIEW_LABELS,
  type ThemeConfig,
  type ThemeColorKey,
  type ThemeSetting,
  type CalendarView,
} from '../lib/theme'

interface ThemeEditorProps {
  theme: ThemeConfig
  onChange: (key: ThemeColorKey, value: Partial<ThemeSetting>) => void
  onEventSizeChange: (size: number) => void
  onDefaultViewChange: (view: CalendarView) => void
  onReset: () => void
}

const EVENT_SIZE_MIN = 0.8
const EVENT_SIZE_MAX = 1.8

export function ThemeEditor({ theme, onChange, onEventSizeChange, onDefaultViewChange, onReset }: ThemeEditorProps) {
  const eventSizeFraction =
    (theme.eventSize - EVENT_SIZE_MIN) / (EVENT_SIZE_MAX - EVENT_SIZE_MIN)
  const eventSizeIsDefault = theme.eventSize === DEFAULT_THEME.eventSize
  const defaultViewIsDefault = theme.defaultView === DEFAULT_THEME.defaultView

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: 'var(--theme-text)' }}>
          Appearance
        </h2>
        <button
          onClick={onReset}
          className="text-xs transition hover:underline"
          style={{ color: 'var(--theme-text-soft)' }}
        >
          Reset to defaults
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-black/[0.03]">
          <span className="shrink-0" style={{ width: '1.75rem' }} aria-hidden />
          <span
            className="w-40 shrink-0 text-sm font-medium"
            style={{ color: 'var(--theme-text)' }}
          >
            Default view
          </span>
          <div className="flex flex-1 items-center">
            <select
              value={theme.defaultView}
              onChange={(e) => onDefaultViewChange(e.target.value as CalendarView)}
              className="w-full cursor-pointer rounded-lg border px-2.5 py-1.5 text-sm"
              style={{
                background: 'var(--theme-surface)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text)',
              }}
            >
              {CALENDAR_VIEWS.map((view) => (
                <option key={view} value={view}>
                  {CALENDAR_VIEW_LABELS[view]}
                </option>
              ))}
            </select>
          </div>
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${defaultViewIsDefault ? 'opacity-0' : 'bg-[var(--theme-event)]'}`} />
        </div>

        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-black/[0.03]">
          <span className="shrink-0" style={{ width: '1.75rem' }} aria-hidden />
          <span
            className="w-40 shrink-0 text-sm font-medium"
            style={{ color: 'var(--theme-text)' }}
          >
            Event size
          </span>
          <div className="flex flex-1 items-center gap-2">
            <input
              type="range"
              min={EVENT_SIZE_MIN}
              max={EVENT_SIZE_MAX}
              step={0.05}
              value={theme.eventSize}
              onChange={(e) => onEventSizeChange(parseFloat(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, var(--theme-event) ${eventSizeFraction * 100}%, #e5e7eb ${eventSizeFraction * 100}%)`,
              }}
            />
            <span
              className="w-10 text-right text-xs tabular-nums"
              style={{ color: 'var(--theme-text-soft)' }}
            >
              {Math.round(theme.eventSize * 100)}%
            </span>
          </div>
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${eventSizeIsDefault ? 'opacity-0' : 'bg-[var(--theme-event)]'}`} />
        </div>

        {(Object.keys(THEME_LABELS) as ThemeColorKey[]).map((key) => {
          const setting = theme[key] ?? DEFAULT_THEME[key]
          const isDefault =
            setting.color === DEFAULT_THEME[key].color &&
            setting.opacity === DEFAULT_THEME[key].opacity

          return (
            <div
              key={key}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-black/[0.03]"
            >
              {/* Color swatch + picker */}
              <label className="relative shrink-0 cursor-pointer">
                <span
                  className="block h-7 w-7 rounded-lg border border-black/10 shadow-sm"
                  style={{ backgroundColor: setting.color, opacity: setting.opacity }}
                />
                <input
                  type="color"
                  value={setting.color}
                  onChange={(e) => onChange(key, { color: e.target.value })}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>

              {/* Label */}
              <span
                className="w-40 shrink-0 text-sm font-medium"
                style={{ color: 'var(--theme-text)' }}
              >
                {THEME_LABELS[key]}
              </span>

              {/* Opacity slider */}
              <div className="flex flex-1 items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={setting.opacity}
                  onChange={(e) => onChange(key, { opacity: parseFloat(e.target.value) })}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
                  style={{
                    background: `linear-gradient(to right, var(--theme-event) ${setting.opacity * 100}%, #e5e7eb ${setting.opacity * 100}%)`,
                  }}
                />
                <span
                  className="w-8 text-right text-xs tabular-nums"
                  style={{ color: 'var(--theme-text-soft)' }}
                >
                  {Math.round(setting.opacity * 100)}%
                </span>
              </div>

              {/* Dot if changed */}
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isDefault ? 'opacity-0' : 'bg-[var(--theme-event)]'}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
