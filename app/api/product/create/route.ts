import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json();

    // Destructure data dari body request
    const { name, description, image, category_id, stock, price, vendor_id, store_id, csrfToken } = body;

    // Validasi sederhana (pastikan semua field ada)
    if (!name || !description || !category_id || !stock || !price || !vendor_id || !store_id || !csrfToken) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Simulasi penyimpanan data ke database (bisa diganti dengan operasi database)
    const newProduct = new Product({
      name,
      description,
      image: image || "", // Biasanya ini perlu disimpan di cloud atau database
      price,
      stock,
      category_id,
      vendor_id,
      store_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newProduct.save();

    // Mengembalikan response JSON
    return NextResponse.json({
      message: "Product created successfully",
    }, {status : 200});
  } catch (error) {
    if (error instanceof Error) {
        console.error('Error message:', error.message);  // Menampilkan pesan error
        console.error('Stack trace:', error.stack);  // Menampilkan stack trace jika ada
      } else {
        // Jika error bukan instance dari Error, tampilkan dalam format JSON
        console.error('Unknown error:', JSON.stringify(error, null, 2));
      }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
