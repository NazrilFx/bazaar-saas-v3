import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Product from "@/models/Product";
import getCookieToken from "@/utils/getCookieToken";


export async function POST(req: NextRequest) {
    await connectDB();
    const { id, price, csrfToken } = await req.json();
    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
        return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
    }

    try {
        if (!id || typeof price !== "number") {
            return NextResponse.json({ message: "ID dan price harus disediakan" }, { status: 400 });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { price },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Stok berhasil diperbarui", product: updatedProduct });
    } catch (error) {
        console.error("Update price Error:", error);
        return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
    }
}
