import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionWithUser } from '@/models/sessionModel';

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    console.log('Session ID:', sessionId);

    if (!sessionId) {
      console.log('No session ID found');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const session = await getSessionWithUser(sessionId);
    console.log('Session from DB:', session);

    if (!session || !session.user) {
      console.log('Session or user not found');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      console.log('Session expired at:', expiresAt);
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.user.id_user,
        nama: session.user.nama,
        email: session.user.email,
      },
    });

  } catch (err) {
    console.error('Error in /api/me:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
