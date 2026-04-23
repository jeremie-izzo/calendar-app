import { useState } from 'react'
import type { ColorRule } from '../lib/types'

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
]

interface RulesPanelProps {
  rules: ColorRule[]
  onAdd: (rule: Omit<ColorRule, 'id'>) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<Omit<ColorRule, 'id'>>) => void
}

interface FormState {
  label: string
  attendeeEmail: string
  color: string
}

const emptyForm: FormState = { label: '', attendeeEmail: '', color: PRESET_COLORS[0] }

function RuleForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: FormState
  submitLabel: string
  onSubmit: (form: FormState) => void
  onCancel?: () => void
}) {
  const [form, setForm] = useState<FormState>(initial)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.attendeeEmail.trim() || !form.label.trim()) return
    onSubmit({ label: form.label.trim(), attendeeEmail: form.attendeeEmail.trim(), color: form.color })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
          Label
        </label>
        <input
          type="text"
          placeholder="e.g. My manager"
          value={form.label}
          onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none"
          style={{
            background: 'var(--theme-topbar, #ffffff)',
            borderColor: 'var(--theme-border, #e5e7eb)',
            color: 'var(--theme-text, #173a40)',
          }}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
          Attendee email
        </label>
        <input
          type="email"
          placeholder="person@example.com"
          value={form.attendeeEmail}
          onChange={(e) => setForm((f) => ({ ...f, attendeeEmail: e.target.value }))}
          className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none"
          style={{
            background: 'var(--theme-topbar, #ffffff)',
            borderColor: 'var(--theme-border, #e5e7eb)',
            color: 'var(--theme-text, #173a40)',
          }}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color: c }))}
              className="h-6 w-6 rounded-full border-2 transition hover:scale-110"
              style={{
                backgroundColor: c,
                borderColor: form.color === c ? 'white' : 'transparent',
                boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
              }}
            />
          ))}
          <label className="relative h-6 w-6 cursor-pointer" title="Custom color">
            <span
              className="block h-6 w-6 rounded-full border-2"
              style={{
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                borderColor: !PRESET_COLORS.includes(form.color) ? 'white' : 'transparent',
                boxShadow: !PRESET_COLORS.includes(form.color) ? `0 0 0 2px ${form.color}` : 'none',
              }}
            />
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-80"
          style={{ background: 'var(--theme-event, #328f97)' }}
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-1.5 text-sm transition hover:opacity-70"
            style={{
              borderColor: 'var(--theme-border, #e5e7eb)',
              color: 'var(--theme-text-soft, #6b7280)',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export function RulesPanel({ rules, onAdd, onRemove, onUpdate }: RulesPanelProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAdd = (form: FormState) => {
    onAdd(form)
    setAddOpen(false)
  }

  const handleUpdate = (id: string, form: FormState) => {
    onUpdate(id, form)
    setEditingId(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: 'var(--theme-border, #e5e7eb)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--theme-text, #173a40)' }}>
          Color Rules
        </h2>
        <button
          onClick={() => { setAddOpen((v) => !v); setEditingId(null) }}
          className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold transition"
          style={{ background: 'var(--theme-event, #328f97)' }}
          title="Add rule"
        >
          {addOpen ? '−' : '+'}
        </button>
      </div>

      {/* Add rule form */}
      {addOpen && (
        <div className="border-b" style={{ borderColor: 'var(--theme-border, #e5e7eb)' }}>
          <RuleForm
            initial={emptyForm}
            submitLabel="Add Rule"
            onSubmit={handleAdd}
            onCancel={() => setAddOpen(false)}
          />
        </div>
      )}

      {/* Rules list */}
      <div className="flex-1 overflow-y-auto">
        {rules.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
            No rules yet. Add one to color events by attendee.
          </p>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'var(--theme-border, #e5e7eb)' }}>
            {rules.map((rule) => (
              <li key={rule.id} style={{ borderColor: 'var(--theme-border, #e5e7eb)' }}>
                {editingId === rule.id ? (
                  <div className="border-b" style={{ borderColor: 'var(--theme-border, #e5e7eb)' }}>
                    <RuleForm
                      initial={{ label: rule.label, attendeeEmail: rule.attendeeEmail, color: rule.color }}
                      submitLabel="Save"
                      onSubmit={(form) => handleUpdate(rule.id, form)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: rule.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium" style={{ color: 'var(--theme-text, #173a40)' }}>
                        {rule.label}
                      </p>
                      <p className="truncate text-xs" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
                        {rule.attendeeEmail}
                      </p>
                    </div>
                    <button
                      onClick={() => { setEditingId(rule.id); setAddOpen(false) }}
                      className="shrink-0 rounded p-1 transition hover:opacity-60"
                      style={{ color: 'var(--theme-text-soft, #6b7280)' }}
                      title="Edit rule"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemove(rule.id)}
                      className="shrink-0 rounded p-1 transition hover:text-red-500"
                      style={{ color: 'var(--theme-text-soft, #6b7280)' }}
                      title="Remove rule"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
