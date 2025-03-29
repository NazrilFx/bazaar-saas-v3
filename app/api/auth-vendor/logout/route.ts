import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logout successful" });

  response.cookies.set("vendor_token", "", {
    expires: new Date(0), 
    path: "/", 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
