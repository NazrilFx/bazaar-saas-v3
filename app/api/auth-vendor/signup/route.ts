import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Vendor from "@/models/Vendor";
import connectDB from "@/lib/dbConnect";
import Activity from "@/models/Activity";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, description, business_type, contact_name, password, phone } = await req.json();

    // Cek apakah email sudah ada
    const existingUser = await Vendor.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: `Email ${existingUser.email} Already Exist` }, { status: 400 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newVendor = new Vendor({
      name,
      email,
      description,
      business_type,
      contact_name,
      verified: true,
      password_hash,
      phone,
      profile_image: "", // Kosong dulu
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newVendor.save();

    const user_id = newVendor._id

    const newActivity = new Activity({
      user_id,
      user_role: "vendor",
      action: `Vendor ${name} signed up with email ${email} and business type ${business_type}`,
      created_at: new Date(),
    })

    await newActivity.save()

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