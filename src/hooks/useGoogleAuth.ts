import { useState, useCallback } from 'react'
import { useGoogleLogin, googleLogout } from '@react-oauth/google'
import { authState } from '../lib/authState'

interface AuthState {
  accessToken: string | null
  userEmail: string | null
}

const STORAGE_KEY = 'gauth'

function loadStored(): AuthState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { accessToken: null, userEmail: null }
    const { accessToken, userEmail, expiresAt } = JSON.parse(raw)
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem(STORAGE_KEY)
      return { accessToken: null, userEmail: null }
    }
    authState.email = userEmail
    return { accessToken, userEmail }
  } catch {
    return { accessToken: null, userEmail: null }
  }
}

function saveStored(accessToken: string, userEmail: string, expiresIn: number) {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ accessToken, userEmail, expiresAt: Date.now() + expiresIn * 1000 }),
  )
}

export function useGoogleAuth() {
  const [auth, setAuth] = useState<AuthState>(loadStored)

  const login = useGoogleLogin({
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    hint: import.meta.env.VITE_GOOGLE_HINT_EMAIL,
    onSuccess: async (tokenResponse) => {
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      }).then((r) => r.json())
      authState.email = userInfo.email
      saveStored(tokenResponse.access_token, userInfo.email, tokenResponse.expires_in ?? 3600)
      setAuth({ accessToken: tokenResponse.access_token, userEmail: userInfo.email })
    },
    onError: (err) => console.error('Google login failed', err),
  })

  const logout = useCallback(() => {
    googleLogout()
    authState.email = null
    sessionStorage.removeItem(STORAGE_KEY)
    setAuth({ accessToken: null, userEmail: null })
  }, [])

  return {
    accessToken: auth.accessToken,
    userEmail: auth.userEmail,
    isAuthenticated: !!auth.accessToken,
    login,
    logout,
  }
}
