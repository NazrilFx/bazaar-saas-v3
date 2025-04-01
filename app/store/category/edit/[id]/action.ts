"use server";

import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function updateCategory(id: string, formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, updated_at: new Date() },
      { new: true } // Mengembalikan data setelah update
    );

    if (!category) {
      throw new Error("Category not found");
    }

    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Update failed" };
  }
}
