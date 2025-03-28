import { NextResponse } from "next/server";
import crypto from "crypto";

// Fungsi untuk membuat token CSRF
function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function GET() {
  const csrfToken = generateCsrfToken();
  
  // Simpan token di cookie HTTP-only
  const response = NextResponse.json({ csrfToken });
  response.cookies.set("csrf_token", csrfToken, {
    httpOnly: true, // Agar tidak bisa diakses via JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return response;
}
