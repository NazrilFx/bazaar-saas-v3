import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Store from "@/models/Store";
import connectDB from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  await connectDB();

  // Ambil token dari cookies
  const token = req.cookies.get("store_token")?.value;
  if (!token) return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });
    }

    // Ambil store dari database tanpa password_hash
    const store = await Store.findById(decoded.id).select("-password_hash");

    if (!store) return NextResponse.json({ store: null, vendor_name: null }, { status: 404 });

    return NextResponse.json({ store });
  } catch (error: unknown) {
    console.error("Login Error:", error);
    return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });
  }
}
