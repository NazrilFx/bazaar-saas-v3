import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";
import getCookieToken from "@/utils/getCookieToken";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, description, csrfToken } = await req.json();

    const csrfTokenFromCookie = getCookieToken(req, "csrf_token");
  
    if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
        return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
    }

    const newCategory = new Category({
        name,
        description,
        created_at: new Date(),
        updated_at: new Date(),
    });
          
    await newCategory.save();

    return NextResponse.json({ message: "Debug Success" });
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


// export async function POST(req: Request) {
//     try {
//       await connectDB();
  
//       const { name, description, csrfToken } = await req.json();
//       const csrfTokenFromCookie = getCookieToken(req, "csrf_token");
  
//       if (!csrfTokenFromCookie || !csrfToken || csrfTokenFromCookie !== csrfToken) {
//         return NextResponse.json({ message: "Invalid CSRF" }, { status: 403 });
//       }
  
//       const newCategory = new Category({
//         name,
//         description,
//         created_at: new Date(),
//         updated_at: new Date(),
//       });
  
//       await newCategory.save();
  
//       return NextResponse.json({ message: "Create category success" }, { status: 201 });
//     } catch (error: unknown) {
//       let errorMessage = "Internal Server Error";
  
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }
  
//       console.error("Signup Error:", error);
//       return NextResponse.json(
//         { message: "Internal Server Error", error: errorMessage },
//         { status: 500 }
//       );
//     }
//   }