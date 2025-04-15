import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";
import Product from "@/models/Product";

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

    await Product.deleteMany({ category_id: id });

    return NextResponse.json({ message: "Category and related products deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
