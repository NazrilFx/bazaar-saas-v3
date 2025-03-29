import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Gunakan jose karena runtime edge tidak mendukung crypto

interface RoleConfig {
  [key: string]: {
    tokenName: string;
    loginUrl: string;
  };
}

const roleConfig: RoleConfig = {
  "/admin": { tokenName: "admin_token", loginUrl: "/login-admin" },
  "/vendor": { tokenName: "vendor_token", loginUrl: "/login-vendor" },
  "/store": { tokenName: "store_token", loginUrl: "/login-store" },
  "/pos": { tokenName: "user_token", loginUrl: "/login" },
};

// Fungsi untuk verifikasi token menggunakan "Jose"
async function verifyToken(token: string, secret: string) {
  try {
    const secretKey = new TextEncoder().encode(secret);
    await jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Cek apakah path masuk ke dalam roleConfig
  const role = Object.keys(roleConfig).find((rolePath) => pathname.startsWith(rolePath));
  if (!role) return NextResponse.next(); // Jika bukan path yang butuh autentikasi, lanjutkan saja

  const { tokenName, loginUrl } = roleConfig[role];
  const token = req.cookies.get(tokenName)?.value;

  // Redirect jika tidak ada token
  if (!token) {
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }

  // Verifikasi token menggunakan jose
  const isValid = await verifyToken(token, process.env.JWT_SECRET as string);
  if (!isValid) {
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/vendor/:path*", "/store/:path*", "/pos/:path*"],
};
