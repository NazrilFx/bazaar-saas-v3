import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
    await connectDB();

    const token = req.cookies.get("store_token")?.value;
    if (!token) return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if (!decoded || typeof decoded === "string" || !decoded.id) {
            return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });
        }

        // Cari order berdasarkan store_id
        const orders = await Order.find({ store_id: decoded.id });

        console.log(orders)

        return NextResponse.json({ orders });
    } catch (error: unknown) {
        console.error("Login Error:", error);
        return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });
    }
}