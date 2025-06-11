export async function handleRegister(data) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) return { success: false, message: json.message || 'Gagal register' }

  return { success: true, userId: json.userId }
}

export async function handleLogin({ email, password }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const json = await res.json()
  if (!res.ok) return { success: false, message: json.message || 'Login gagal' }

  return {
    success: true,
    sessionId: json.sessionId,
    user: json.user,
  }
}

