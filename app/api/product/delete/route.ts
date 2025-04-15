import { NextResponse } from "next/server";
import Product from "@/models/Product";
import dbConnect from "@/lib/dbConnect";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

        const { id, csrfToken } = await req.json();

        if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
            return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
        }


        if (!id) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to delete product:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
