import { createFileRoute, Link } from '@tanstack/react-router'
import { RulesPanel } from '../components/RulesPanel'
import { ThemeEditor } from '../components/ThemeEditor'
import { CalendarPreview } from '../components/CalendarPreview'
import { useColorRules } from '../hooks/useColorRules'
import { useTheme } from '../hooks/useTheme'

export const Route = createFileRoute('/settings')({component: SettingsPage})

function SettingsPage() {
    const {rules, addRule, removeRule, updateRule} = useColorRules()
    const {theme, updateSetting, reset} = useTheme()

    return (
        <div className="flex h-screen flex-col" style={{background: 'var(--theme-bg, #f3f4f6)'}}>
            {/* Top bar */}
            <div
                className="flex items-center gap-3 border-b px-6 py-4"
                style={{
                    background: 'var(--theme-topbar, #ffffff)',
                    borderColor: 'var(--theme-border, #e5e7eb)',
                }}
            >
                <Link
                    to="/"
                    className="flex items-center gap-1.5 text-sm no-underline transition hover:opacity-70"
                    style={{color: 'var(--theme-text-soft, #6b7280)'}}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    Back to calendar
                </Link>
                <span style={{color: 'var(--theme-border, #e5e7eb)'}}>|</span>
                <h1 className="text-sm font-semibold" style={{color: 'var(--theme-text, #173a40)'}}>
                    Settings
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto max-w-5xl space-y-8">

                    {/* Appearance */}
                    <section className="grid grid-cols-2 gap-4 items-stretch">
                        {/* Controls */}
                        <div
                            className="rounded-2xl border p-5 h-full"
                            style={{
                                background: 'var(--theme-surface, #ffffff)',
                                borderColor: 'var(--theme-border, #e5e7eb)',
                            }}
                        >
                            <ThemeEditor theme={theme} onChange={updateSetting} onReset={reset}/>
                        </div>

                        {/* Live preview */}
                        <div
                            className="rounded-2xl border overflow-hidden"
                            style={{
                                background: 'var(--theme-surface, #ffffff)',
                                borderColor: 'var(--theme-border, #e5e7eb)',
                            }}
                        >
                            <CalendarPreview defaultEventColor={theme.defaultEventColor.color}/>
                        </div>
                    </section>

                    {/* Color Rules */}
                    <section>
                        <h2 className="mb-1 text-base font-semibold" style={{color: 'var(--theme-text, #173a40)'}}>
                            Color Rules
                        </h2>
                        <p className="mb-4 text-sm" style={{color: 'var(--theme-text-soft, #6b7280)'}}>
                            Color events based on who is invited. Rules are applied in order — first match wins.
                        </p>
                        <div
                            className="rounded-2xl border"
                            style={{
                                background: 'var(--theme-surface, #f3f4f6)',
                                borderColor: 'var(--theme-border, #e5e7eb)',
                            }}
                        >
                            <RulesPanel rules={rules} onAdd={addRule} onRemove={removeRule} onUpdate={updateRule}/>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}
