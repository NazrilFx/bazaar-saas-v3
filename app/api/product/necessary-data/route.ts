import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";
import Store from "@/models/Store";

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    // Ambil cookies JWT
    const storeToken = req.cookies.get("store_token")?.value;

    if (!storeToken) {
      return NextResponse.json({ message: "JWT token not found" }, { status: 401 });
    }

    const storeDecoded = jwt.verify(storeToken, process.env.JWT_SECRET!) as JwtPayload;

    if (!storeDecoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Ambil seluruh kategori
    const categories = await Category.find().select('_id, name');

    const store = await Store.findById(storeDecoded.id).select("-password_hash"); // hindari kirim password

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({
      categories,
      store_id: store.id,
      vendor_id: store.vendor_id,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}