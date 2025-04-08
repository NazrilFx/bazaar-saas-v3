import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Vendor from "@/models/Vendor";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { vendorId, csrfToken } = await req.json();
        const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

        if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
            return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
        }

        if (!vendorId) {
            return NextResponse.json({ message: "Vendor ID is required" }, { status: 400 });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { verified: true },
            { new: true }
        );

        if (!updatedVendor) {
            return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Vendor activated", vendor: updatedVendor });
    } catch (error) {
        console.error("Activate error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
