import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Store from "@/models/Store";
import connectDB from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, description, vendor_id, password, location } = await req.json();

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
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: error.message, error: error.message },
      { status: 500 }
    );
  }
}