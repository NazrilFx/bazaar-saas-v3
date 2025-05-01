import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Ambil semua cookies dari request
  const cookies = request.cookies.getAll();

  // Ubah cookies ke dalam format objek key-value
  const cookieData = Object.fromEntries(
    cookies.map((cookie) => [cookie.name, cookie.value])
  );

  // Format JSON yang rapi dengan indentasi 2 spasi
  const jsonResponse = JSON.stringify(
    {
      message: 'Cookies berhasil diambil',
      cookies: cookieData,
    },
    null, // replacer
    2     // indentasi
  );

  return new NextResponse(jsonResponse, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
