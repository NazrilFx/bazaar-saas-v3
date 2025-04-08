import { NextRequest, NextResponse } from "next/server";
import Vendor from "@/models/Vendor";
import Store from "@/models/Store"; // pastikan model Store sudah ada dan benar
import connectDB from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const activeVendors = await Vendor.find().lean();

    // Ambil semua store dan grupkan berdasarkan vendor_id
    const allStores = await Store.find({}).lean();

    const getStoreCount = (vendors: any[]) =>
      vendors.map((vendor) => {
        const storeCount = allStores.filter(
          (store) => store.vendor_id?.toString() === vendor._id.toString()
        ).length;

        return {
          ...vendor,
          storeCount,
        };
      });

    const vendorsWithCount = getStoreCount(activeVendors);

    return new Response(
      JSON.stringify(
        {
          vendors: vendorsWithCount,
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching vendor status:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor status" },
      { status: 500 }
    );
  }
}
