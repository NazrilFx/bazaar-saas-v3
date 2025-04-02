import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Ambil data dari body request
    const { id } = await req.json();

    // Mencari dan menghapus kategori berdasarkan ID
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
