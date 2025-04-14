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

        // Hitung waktu 24 jam yang lalu
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Update order dengan status pending menjadi canceled ketika sudah melewati 24 jam
        await Order.updateMany(
            {
                store_id: decoded.id,
                status: "pending",
                created_at: { $lt: twentyFourHoursAgo },
            },
            {
                $set: { status: "cancelled" },
            }
        );

        // Cari order berdasarkan store_id
        const orders = await Order.find({ store_id: decoded.id });

        // Cari orders dengan status pending dan dibuat lebih dari 24 jam lalu
        return new NextResponse(JSON.stringify({ orders }, null, 2), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        console.error("Login Error:", error);
        return NextResponse.json({ store: null, vendor_name: null }, { status: 401 });
    }
}