import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import Product from "@/models/Product";
import connectDB from "@/lib/dbConnect";
import Order from "@/models/Order";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    await connectDB(); // Koneksi ke database

    const today = new Date();
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

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
      .lean();

    // Ambil semua kategori
    const categories = await Category.find().select("id name").lean();

    // Buat mapping kategori agar lebih cepat dicari
    const categoryMap = new Map(categories.map(category => [category._id.toString(), category.name]));

    const latestFourProducts = await Product.find({ store_id: storeId })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("id name category_id price stock image")
      .lean();

    const formattedProducts = latestFourProducts.map(({ category_id, _id, ...product }) => ({
      ...product, // Spread semua data kecuali category_id dan _id
      _id: _id.toString(), // Mengubah _id menjadi string
      category: categoryMap.get(category_id?.toString()) || "Unknown", // Ambil nama kategori
      status:
        product.stock === 0 ? "out_of_stock" :
          product.stock < 10 ? "low_stock" :
            "in_stock"
    }));

    const orders = await Order.find({ store_id: storeId }).lean()

    const recentOrders = await Order.find({ store_id: storeId })
      .sort({ created_at: -1 }) // Urutkan dari yang terbaru (descending)
      .limit(4);

    const ordersThisMonth = await Order.countDocuments({
      store_id: storeId,
      created_at: { $gte: startOfThisMonth, $lte: endOfThisMonth },
    });

    const ordersLastMonth = await Order.countDocuments({
      store_id: storeId,
      created_at: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const productsOutOfStock = products.filter((product) => product.stock == 0)

    const salesThisMonth = await Order.find({
      status: "paid",
      store_id: storeId,
      created_at: { $gte: startOfThisMonth, $lte: endOfThisMonth },
    }).select("total_amount")

    const salesLastMonth = await Order.find({
      status: "paid",
      store_id: storeId,
      created_at: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    }).select("total_amount")

    const totalSalesThisMonth = Math.floor(
      salesThisMonth.reduce((sum, order) => sum + order.total_amount, 0)
    );

    const totalSalesLastMonth = Math.floor(
      salesLastMonth.reduce((sum, order) => sum + order.total_amount, 0)
    );

    return new Response(
      JSON.stringify({
        latestFourProducts: formattedProducts,
        products: products.length,
        productsOutOfStock: productsOutOfStock.length,
        recentOrders,
        ordersLastMonth,
        ordersThisMonth,
        totalSalesThisMonth,
        totalSalesLastMonth,
      }, null, 2),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
