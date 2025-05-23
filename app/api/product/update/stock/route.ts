import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Product from "@/models/Product";
import getCookieToken from "@/utils/getCookieToken";


export async function POST(req: NextRequest) {
    await connectDB();
    const { id, stock, csrfToken } = await req.json();
    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
        return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
    }

    try {
        if (!id || typeof stock !== "number") {
            return NextResponse.json({ message: "ID dan stock harus disediakan" }, { status: 400 });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { stock },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Stok berhasil diperbarui", product: updatedProduct });
    } catch (error) {
        console.error("Update Stock Error:", error);
        return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
    }
}
