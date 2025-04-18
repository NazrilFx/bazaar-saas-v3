import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Order from "@/models/Order";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, midtrans_token, csrfToken } = body;
    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
      return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
    }


    console.log(body)

    if (!id) {
      return NextResponse.json({ message: "ID wajib diisi" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order tidak ditemukan" }, { status: 404 });
    }

    if (!midtrans_token) {
      return NextResponse.json({ message: "Token tidak ditemukan, gagal mengupdate token" }, { status: 404 });
    }

    order.midtrans_token = midtrans_token;
    await order.save();

    return NextResponse.json({ message: "Order berhasil diupdate", order });
  } catch (error) {
    console.error("Gagal update order:", error);
    return NextResponse.json({ message: "Terjadi kesalahan", error: (error as Error).message }, { status: 500 });
  }
}