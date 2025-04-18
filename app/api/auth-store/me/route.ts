import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Store from "@/models/Store";
import Vendor from "@/models/Vendor"; // Import model Vendor
import connectDB from "@/lib/dbConnect";
import Event from "@/models/Event"

export async function GET(req: NextRequest) {
  await connectDB();

  const today = new Date();
  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

  // Ambil token dari cookies
  const token = req.cookies.get("store_token")?.value;
  if (!token) return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });
    }

    const storeId = decoded.id

    const event = await Event.findOne({
      created_at: { $gte: startOfThisMonth, $lte: endOfThisMonth },
      storesId: { $in: storeId }
    }).select("name").lean();

    // Ambil store dari database tanpa password_hash
    const store = await Store.findById(decoded.id).select("-password_hash");

    if (!store) return NextResponse.json({ store: null, vendor_name: null }, { status: 404 });

    // Ambil nama vendor berdasarkan vendor_id
    const vendor = await Vendor.findById(store.vendor_id).select("name").lean();
    const vendorName = vendor?.name || null;

    return NextResponse.json({
      store, vendor_name: vendorName, event: event?.name,
    });
  } catch (error: unknown) {
    console.error("Login Error:", error);
    return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });
  }
}
