import { db } from '@/lib/db'

export async function findUserByEmail(email) {
  const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email])
  return rows[0] || null
}

export async function createUser({ nama, email, password }) {
  const [result] = await db.query(
    'INSERT INTO user (nama, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
    [nama, email, password]
  )
  return result.insertId
}
