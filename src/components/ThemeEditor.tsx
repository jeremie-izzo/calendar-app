import { THEME_LABELS, DEFAULT_THEME, type ThemeConfig, type ThemeSetting } from '../lib/theme'

interface ThemeEditorProps {
  theme: ThemeConfig
  onChange: (key: keyof ThemeConfig, value: Partial<ThemeSetting>) => void
  onReset: () => void
}

export function ThemeEditor({ theme, onChange, onReset }: ThemeEditorProps) {
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
        {(Object.keys(THEME_LABELS) as (keyof ThemeConfig)[]).map((key) => {
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
