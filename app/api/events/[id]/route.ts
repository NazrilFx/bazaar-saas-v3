import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import jwt, { JwtPayload } from "jsonwebtoken";
import Vendor from "@/models/Vendor";
import Store from "@/models/Store";
import connectDB from "@/lib/dbConnect";
import { Types } from "mongoose";
import Admin from "@/models/Admin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const id = (await params).id
    const token = req.cookies.get("admin_token")?.value;

    if (!token) return NextResponse.json({ admin: token }, { status: 401 });
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid event ID." },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const event = await Event.findById(id).lean();

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Ambil user dari database tanpa password_hash
    const admin = await Admin.findById(decoded.id).select("-password_hash");

    if (!admin) return NextResponse.json({ admin: null }, { status: 404 });

    // Ambil semua vendor dan store, hanya field _id dan name
    const vendors = await Vendor.find({}, "_id name");
    const stores = await Store.find({}, "_id name");


    if (!event) {
      return NextResponse.json(
        { error: "Event not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { event, admin, vendors, stores },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event." },
      { status: 500 }
    );
  }
}
