function loadStoredEmail(): string | null {
  try {
    const raw = sessionStorage.getItem('gauth')
    if (!raw) return null
    const { userEmail, expiresAt } = JSON.parse(raw)
    return Date.now() > expiresAt ? null : userEmail
  } catch {
    return null
  }
}

export const authState = {
  email: typeof sessionStorage !== 'undefined' ? loadStoredEmail() : null,
}
