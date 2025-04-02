import { NextRequest ,NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    // Ambil cookies JWT
    const storeToken = req.cookies.get("store_token")?.value;
    const vendorToken = req.cookies.get("vendor_token")?.value;

    if (!storeToken || !vendorToken) {
      return NextResponse.json({ message: "JWT token not found" }, { status: 401 });
    }

   const storeDecoded = jwt.verify(storeToken, process.env.JWT_SECRET!) as JwtPayload;
   const vendorDecoded = jwt.verify(vendorToken, process.env.JWT_SECRET!) as JwtPayload;

    if (!storeDecoded  || !vendorDecoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Ambil seluruh kategori
    const categories = await Category.find().select('_id, name');

    return NextResponse.json({
      categories,
      store_id : storeDecoded.id,
      vendor_id : vendorDecoded.id,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}