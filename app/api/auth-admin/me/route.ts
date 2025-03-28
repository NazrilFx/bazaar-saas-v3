import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Admin from "@/models/Admin";
import connectDB from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  await connectDB();

  // Ambil token dari cookies
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Ambil user dari database tanpa password_hash
    const user = await Admin.findById(decoded.id).select("-password_hash");

    if (!user) return NextResponse.json({ user: null }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
