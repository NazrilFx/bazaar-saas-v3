import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const {
      id,
      name,
      description,
      price,
      stock,
      image,
      category_id,
    } = await req.json();

    // Validasi ID
    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Temukan dan update produk
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        image,
        category_id,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
