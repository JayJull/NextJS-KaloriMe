import { supabase } from "@/lib/db"

export async function findUserByEmail(email) {
  const [rows] = await supabase.query('SELECT * FROM user WHERE email = ?', [email])
  return rows[0] || null
}

export async function createUser({ nama, email, password }) {
  const [result] = await supabase.query(
    'INSERT INTO user (nama, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
    [nama, email, password]
  )
  return result.insertId
}
