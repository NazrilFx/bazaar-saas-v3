import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Category from '@/models/Category';

export async function POST(req: Request) {
  try {
    // Koneksi ke database
    await connectDB();

    // Ambil data dari form
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    // Validasi jika id, name, atau description kosong
    if (!id || !name || !description) {
      return NextResponse.json(
        { message: "ID, name, and description are required" },
        { status: 400 }
      );
    }

    // Cari kategori berdasarkan ID dan update
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, updated_at: new Date() },
      { new: true } // Mengembalikan kategori yang sudah diupdate
    );

    // Jika kategori tidak ditemukan
    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Redirect ke halaman kategori setelah update
    const redirectUrl = new URL('/store/category', req.url).toString();

    // Kirimkan respons redirect
    return NextResponse.redirect(redirectUrl);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
