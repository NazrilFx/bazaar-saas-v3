import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Vendor from "@/models/Vendor";

export async function GET() {
  try {
    await connectDB();

    // Ambil vendor yang "active" bernilai false
    const inactiveVendors = await Vendor.find({ verified: false }).lean();

    return NextResponse.json({ inactiveVendors }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
