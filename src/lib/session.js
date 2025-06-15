import { cookies } from 'next/headers'
import { findUserBySession } from '@/src/models/sessionModel'

export async function getSession() {
  const sessionId = cookies().get('session_id')?.value
  if (!sessionId) return null
  return await findUserBySession(sessionId)
}
