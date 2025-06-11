import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ error: "Email tidak ada" }, { status: 400 });

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log("HASIL DB QUERY:", result);

    return NextResponse.json(rows[0]); // <--- kalau rows undefined/null, error
  } catch (error) {
    console.error("API PROFILE GET ERROR", error);
    return NextResponse.json({ error: "Gagal ambil profil" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas } = body;

    if (!email || !nama) {
      return NextResponse.json({ error: "Email dan nama wajib diisi." }, { status: 400 });
    }

    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      await db.query(`
        UPDATE users SET nama = ?, umur = ?, berat_badan = ?, tinggi_badan = ?, tingkat_aktivitas = ?
        WHERE email = ?
      `, [nama, umur, berat_badan, tinggi_badan, tingkat_aktivitas, email]);
    } else {
      await db.query(`
        INSERT INTO users (nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [nama, email, umur, berat_badan, tinggi_badan, tingkat_aktivitas]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 ERROR POST /api/profile:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}