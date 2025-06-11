import db from '@/src/lib/db'
import bcrypt from 'bcrypt'

// Cek user berdasarkan email (untuk login atau validasi register)
export async function findUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email])
  return rows[0] || null
}

// Buat user baru
export async function registerUser({ nama, email, password, umur, berat_badan, tinggi_badan, tingkat_aktivitas }) {
  const hashedPassword = await bcrypt.hash(password, 10)

  const [result] = await db.execute(
    `INSERT INTO user (nama, email, password, umur, berat_badan, tinggi_badan, tingkat_aktivitas, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [nama, email, hashedPassword, umur, berat_badan, tinggi_badan, tingkat_aktivitas]
  )

  return result.insertId
}

// Validasi login
export async function loginUser(email, password) {
  const user = await findUserByEmail(email)
  if (!user) {
    return { success: false, message: 'User tidak ditemukan' }
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return { success: false, message: 'Password salah' }
  }

  // Jangan kirim password ke frontend
  delete user.password

  return { success: true, user }
}
