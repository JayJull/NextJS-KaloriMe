import { db } from "@/lib/db"

export async function createSession(userId, sessionId, expiresAt) {
  await db.query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [sessionId, userId, expiresAt]
  )
}

export async function deleteSession(sessionId) {
  await db.query('DELETE FROM sessions WHERE id = ?', [sessionId])
}

export async function findUserBySession(sessionId) {
  const [rows] = await db.query(`
    SELECT users.id, users.name, users.email
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ? AND sessions.expires_at > NOW()
  `, [sessionId])
  return rows[0]
}

export async function getSessionWithUser(sessionId) {
  const [rows] = await db.query(`
    SELECT sessions.id AS session_id, sessions.expires_at,
           user.id_user AS id_user, user.nama AS nama, user.email
    FROM sessions
    JOIN user ON user.id_user = sessions.user_id
    WHERE sessions.id = ?
  `, [sessionId]);

  if (rows.length === 0) return null;

  return {
    id: rows[0].session_id,
    expires_at: rows[0].expires_at,
    user: {
      id_user: rows[0].id_user,
      nama: rows[0].nama,
      email: rows[0].email
    }
  };
}

