import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Vendor from "@/models/Vendor";
import connectDB from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  await connectDB();

  // Ambil token dari cookies
  const token = req.cookies.get("vendor_token")?.value;
  if (!token) return NextResponse.json({ vendor: null }, { status: 401 });

  try {
    // Verifikasi token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ vendor: null }, { status: 401 });
    }

    // Ambil vendor dari database tanpa password_hash
    const vendor = await Vendor.findById(decoded.id).select("-password_hash");

    if (!vendor) return NextResponse.json({ vendor: null }, { status: 404 });

    // Ubah vendor menjadi objek biasa & pastikan `_id` dalam bentuk string
    return NextResponse.json({ vendor: { ...vendor.toObject(), _id: vendor._id.toString() } });
  } catch (error) {
    return NextResponse.json({ vendor: null }, { status: 401 });
  }
}
