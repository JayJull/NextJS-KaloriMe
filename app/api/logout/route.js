import { NextResponse } from 'next/server';

// Contoh fungsi hapus session di DB, sesuaikan dengan DB-mu
async function deleteSession(sessionId) {
  // Contoh: await db.query('DELETE FROM sessions WHERE id = ?', [sessionId]);
  console.log('Delete session:', sessionId);
}

export async function POST(request) {
  const cookie = request.cookies.get('session_id');
  console.log('sessionId cookie:', cookie);

  if (!cookie) {
    return NextResponse.json({ error: 'No session found' }, { status: 400 });
  }

  await deleteSession(cookie.value);

  const response = NextResponse.json({ message: 'Logged out' });

  // Hapus cookie sessionId (pastikan path & domain sesuai cookie saat set)
  response.cookies.set({
    name: 'sessionId',
    value: '',
    maxAge: 0,
    path: '/',   // sesuaikan path cookie
  });

  return response;
}
