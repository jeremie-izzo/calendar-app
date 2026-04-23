interface GoogleSignInProps {
  onLogin: () => void
}

export function GoogleSignIn({ onLogin }: GoogleSignInProps) {
  return (
    <main
      className="flex h-screen w-screen items-center justify-center"
      style={{ background: 'var(--theme-bg, #f3f4f6)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-10 text-center"
        style={{
          background: 'var(--theme-surface, #ffffff)',
          borderColor: 'var(--theme-border, #e5e7eb)',
        }}
      >
        <div className="mb-5 text-4xl">📅</div>
        <h1 className="mb-2 text-xl font-semibold" style={{ color: 'var(--theme-text, #173a40)' }}>
          Calendar
        </h1>
        <p className="mb-8 text-sm" style={{ color: 'var(--theme-text-soft, #6b7280)' }}>
          Connect your Google Calendar to view events and apply color rules by attendee.
        </p>
        <button
          onClick={onLogin}
          className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:shadow-md active:shadow-none"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </main>
  )
}
