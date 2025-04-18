import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Order from "@/models/Order"; // pastikan path ini sesuai dengan lokasi model kamu
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, status, payment_method, csrfToken } = body;

        const csrfTokenFromCookie = getCookieToken(req, "csrf_token");
    
        if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
          return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
        }
    

    if (!id || !status) {
      return NextResponse.json({ message: "ID dan status wajib diisi" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order tidak ditemukan" }, { status: 404 });
    }

    order.status = status;
    order.payment_method = payment_method || order.payment_method;
    await order.save();

    return NextResponse.json({ message: "Order berhasil diupdate", order });
  } catch (error) {
    console.error("Gagal update order:", error);
    return NextResponse.json({ message: "Terjadi kesalahan", error: (error as Error).message }, { status: 500 });
  }
}