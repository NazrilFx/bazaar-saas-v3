import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import connectDB from "@/lib/dbConnect";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");
    const { name, email, password, role, csrfToken } = await req.json();

    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
      return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
    }

    // Cek apakah email sudah ada
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = new Admin({
      name,
      email,
      role,
      password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    let errorMessage = "Internal Server Error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}