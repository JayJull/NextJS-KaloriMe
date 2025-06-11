import { findUserByEmail, createUser } from '@/models/userModel'
import bcrypt from 'bcryptjs'

export async function handleRegister({ nama, email, password }) {
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    return { success: false, message: 'Email sudah digunakan' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const userId = await createUser({ name: nama, email, hashedPassword })

  return { success: true, userId }
}
