import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Store from "@/models/Store";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";
import Vendor from "@/models/Vendor";

interface PopulatedProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category_id: {
    name: string;
  };
}

export async function GET(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("store_token")?.value;
  if (!token) return NextResponse.json({ store: null }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ store: null }, { status: 401 });
    }

    const store = await Store.findById(decoded.id).select("-password_hash");
    const vendor = await Vendor.findById(store?.vendor_id).select("email phone");
    if (!store || !vendor) {
      return NextResponse.json({ store: null }, { status: 401 });
    }

    // Ambil nama kategori saja
    const categories = await Category.find({}, "name").lean();
    const categoryNames = categories.map((cat) => cat.name);

    // Ambil produk milik store dan populate category_id
    const productDocs = await Product.find({ store_id: store._id })
      .populate("category_id", "name")
      .lean<PopulatedProduct[]>();

    const products = productDocs.map((prod) => ({
      id: prod._id.toString(),
      name: prod.name,
      price: prod.price,
      category: prod.category_id?.name ?? "Unknown",
      description: prod.description,
      image: prod.image,
    }));

    return new Response(
      JSON.stringify({ categories: categoryNames, products, storeName: store.name, vendorEmail: vendor.email, vendorPhone: vendor.phone, storeId: store._id }, null, 2),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
