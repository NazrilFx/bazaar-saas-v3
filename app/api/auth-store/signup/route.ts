import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Store from "@/models/Store";
import connectDB from "@/lib/dbConnect";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, description, vendor_id, password, location, csrfToken } = await req.json();
    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
      return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
    }

    // Cek apakah email sudah ada
    const existingUser = await Store.findOne({ name });
    if (existingUser) {
      return NextResponse.json({ message: `Store ${existingUser.name} Already Exist` }, { status: 400 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newStore = new Store({
      name,
      description,
      vendor_id,
      location,
      active: true,
      password_hash,
      profile_image: "", // Kosong dulu
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newStore.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    let errorMessage = "Internal Server Error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: errorMessage, error: errorMessage },
      { status: 500 }
    );
  }
}