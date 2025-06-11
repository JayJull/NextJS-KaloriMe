import { NextResponse } from 'next/server'
import { findUserByEmail } from '@/models/userModel'
import { createSession } from '@/models/sessionModel'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Email & password wajib diisi' }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ message: 'Email tidak ditemukan' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ message: 'Password salah' }, { status: 401 })
    }

    const sessionId = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
    await createSession(user.id_user, sessionId, expiresAt)

    // Buat response dan set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id_user,
        nama: user.nama,
        email: user.email,
      },
    })

    response.cookies.set({
      name: 'session_id',
      value: sessionId,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    })

    return response
  } catch (error) {
    console.error('LOGIN ERROR:', error)
    return NextResponse.json({ message: 'Login gagal' }, { status: 500 })
  }
}
