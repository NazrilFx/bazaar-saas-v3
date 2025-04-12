// route.ts untuk mengambil produk berdasarkan store_id dan menentukan apakah pemiliknya

import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Product from "@/models/Product";
import Store from "@/models/Store";
import Category from "@/models/Category";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const { id } = await params;

    try {
        const token = req.cookies.get("store_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded === "string" || !decoded.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const store = await Store.findById(decoded.id).select("-password_hash");

        if (!id) {
            return NextResponse.json({ error: "productId is required" }, { status: 400 });
        }

        const currentStore = await Store.findById(decoded.id);
        if (!currentStore) return NextResponse.json({ error: "Store not found" }, { status: 404 });


        if (!store || !store._id) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const product = await Product.findById(id).lean(); // .lean() biar jadi plain object
        if (!product || !product._id) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Ambil semua produk dengan store_id yang dikirim lewat query
        const isOwner = store._id.toString() === product.store_id.toString(); // akan bernilai true jika store ditemukan, false jika null
        const categoriesRaw = await Category.find({}, "_id name").lean();
        const productCategory = await Category.findById(product._id).select("_id").lean()

        const categories = categoriesRaw.map((cat) => ({
          _id: cat._id.toString(),
          name: cat.name,
        }));
    
        return new Response(JSON.stringify({
            product,
            isOwner,
            categories,
            productCategory
          }, null, 2), {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          });
                    
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
