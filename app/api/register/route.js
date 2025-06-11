import { NextResponse } from 'next/server'
import { createUser } from '@/models/userModel'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const body = await req.json()
    const { nama, email, password } = body

    if (!nama || !email || !password) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = await createUser({ nama, email, password: hashedPassword })

    return NextResponse.json({ userId }, { status: 201 })
  } catch (error) {
    console.error('ERROR REGISTER:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

