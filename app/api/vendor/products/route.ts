import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import jwt, { JwtPayload } from "jsonwebtoken";
import Store from "@/models/Store";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const token = req.cookies.get("vendor_token")?.value;
        if (!token) return NextResponse.json({ vendor: null }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if (!decoded || typeof decoded === "string" || !decoded.id) {
            return NextResponse.json({ vendor: null }, { status: 401 });
        }

        // Ambil semua kategori
        const categories = await Category.find().select("id name").lean();

        // Buat mapping kategori agar lebih cepat dicari
        const categoryMap = new Map(categories.map(category => [category._id.toString(), category.name]));

        const stores = await Store.find({ vendor_id: decoded.id }).select("_id name").lean();

        const storesMap = new Map(stores.map(store => [store._id.toString(), store.name]));

        const products = await Product.find({ store_id: { $in: stores } }).select("-vendor_id").lean()

        const formattedProducts = products.map(({ _id, category_id, store_id, ...product }) => ({
            ...product, // Spread semua data kecuali category_id
            id : _id.toString(),
            store: storesMap.get(store_id.toString()) || "Unknown",
            category: categoryMap.get(category_id?.toString()) || "Unknown", // Ambil nama kategori
            status:
                product.stock === 0 ? "out_of_stock" :
                    product.stock < 10 ? "low_stock" :
                        "in_stock"
        }));

        if (!stores) {
            return NextResponse.json({ stores: [] }, { status: 404 });
        }

        return new Response(JSON.stringify({ formattedProducts }, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Failed to fetch stores by vendor ID:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
