import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import jwt, { JwtPayload } from "jsonwebtoken";
import Admin from "@/models/Admin";
import Vendor from "@/models/Vendor";
import Store from "@/models/Store";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("admin_token")?.value;
        if (!token) return NextResponse.json({ admin: null }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if (!decoded || typeof decoded === "string" || !decoded.id) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        // Ambil user dari database tanpa password_hash
        const admin = await Admin.findById(decoded.id).select("-password_hash");

        if (!admin) return NextResponse.json({ admin: null }, { status: 404 });

        // Ambil semua vendor dan store, hanya field _id dan name
        const vendors = await Vendor.find({}, "_id name");
        const stores = await Store.find({}, "_id name");

        // Gabungkan dan kirim response
        return NextResponse.json({
            vendors,
            stores,
            admin,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching vendors and stores:", error);
        return NextResponse.json({ message: "Failed to fetch data" }, { status: 500 });
    }
}
