import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Activity from "@/models/Activity";
import connectDB from "@/lib/dbConnect";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password, phone, csrfToken } = await req.json();
    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");

    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
      return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
    }

    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = new User({
      name,
      email,
      password_hash,
      phone,
      profile_image: "", // Kosong dulu
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newUser.save();

    const user_id = newUser._id
    
    const newActivity = new Activity ({
      user_id,
      user_role : "user",
      action : `User ${name} signed up with email ${email}`,
      created_at : new Date(),
    })

    await newActivity.save()

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error: unknown) {
    let errorMessage = "Internal Server Error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}