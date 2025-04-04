import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Product from "@/models/Product";
import Category from "@/models/Category"; // Import model Category
import connectDB from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    try {
        await connectDB(); // Koneksi ke database

        const token = req.cookies.get("store_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "JWT token not found" }, { status: 401 });
        }

        // Verifikasi token dan ambil store_id
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const storeId = decoded.id;

        if (!storeId) {
            return NextResponse.json({ message: "Invalid token or store_id missing" }, { status: 401 });
        }

        // Ambil semua produk berdasarkan store_id
        const products = await Product.find({ store_id: storeId })
            .sort({ createdAt: -1 })
            .select("id name price stock image category_id") // Ambil category_id
            .lean();

        // Ambil semua kategori
        const categories = await Category.find().select("id name").lean();

        // Buat mapping kategori agar lebih cepat dicari
        const categoryMap = new Map(categories.map(category => [category._id.toString(), category.name]));

        // Format produk dengan menambahkan nama kategori
        const formattedProducts = products.map(({ category_id, ...product }) => ({
            ...product, // Spread semua data kecuali category_id
            category: categoryMap.get(category_id?.toString()) || "Unknown", // Ambil nama kategori
            status:
                product.stock === 0 ? "out_of_stock" :
                product.stock < 10 ? "low_stock" :
                "in_stock"
        }));
        
        return NextResponse.json({ products: formattedProducts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
