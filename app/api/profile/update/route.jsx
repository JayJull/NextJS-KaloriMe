export async function POST(request) {
  const body = await request.json();
  const { name, email } = body;

  // contoh: update ke database
  console.log('Data diterima:', { name, email });

  return Response.json({ message: 'Berhasil update' });
}