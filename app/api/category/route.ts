import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB(); // Pastikan koneksi ke database

    const categories = await Category.find({}).sort({ created_at: -1 }); // Ambil semua kategori dan urutkan dari terbaru

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
