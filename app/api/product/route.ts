import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Product from "@/models/Product";
import connectDB from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    try {
        await connectDB(); // Pastikan koneksi ke database

        const token = req.cookies.get("store_token")?.value;

        if (!token) {
            return NextResponse.json({ message: "JWT token not found" }, { status: 401 });
        }

        // Verifikasi token dan ambil store_id
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const storeId = decoded.id; // Ambil store_id dari payload token

        if (!storeId) {
            return NextResponse.json({ message: "Invalid token or store_id missing" }, { status: 401 });
        }

        // Cari produk berdasarkan store_id yang ada pada token
        const product = await Product.find({ store_id: storeId }).sort({ created_at: -1 }).exec(); // Filter berdasarkan store_id

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
