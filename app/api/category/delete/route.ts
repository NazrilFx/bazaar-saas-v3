import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";
import Product from "@/models/Product";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

    // Ambil data dari body request
    const { id, csrfToken } = await req.json();

    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
      return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
    }


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
