import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Store from "@/models/Store";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { storeId, csrfToken } = await req.json();
        const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

        if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
            return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
        }

        if (!storeId) {
            return NextResponse.json({ message: "Store ID is required" }, { status: 400 });
        }

        const updatedStore = await Store.findByIdAndUpdate(
            storeId,
            { active: false },
            { new: true }
        );

        if (!updatedStore) {
            return NextResponse.json({ message: "Store not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Store deactivated", store: updatedStore });
    } catch (error) {
        console.error("Deactivate error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
