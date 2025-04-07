import { NextRequest, NextResponse } from "next/server";
import Activity from "@/models/Activity";
import Admin from "@/models/Admin";
import Vendor from "@/models/Vendor";
import User from "@/models/User";
import Store from "@/models/Store";
import connectDB from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    try {
        await connectDB(); // Pastikan koneksi ke database

        // Ambil 5 activity terbaru
        const activities = await Activity.find()
            .sort({ created_at: -1 }) // Urutkan dari terbaru
            .limit(5) // Ambil 5 data
            .lean();

        // Ambil semua user_id yang unik untuk dicari sekaligus
        const userIds = activities.map((activity) => activity.user_id);

        // Cari user dari semua koleksi
        const adminUsers = await Admin.find({ _id: { $in: userIds } }).select("_id name").lean();
        const vendorUsers = await Vendor.find({ _id: { $in: userIds } }).select("_id name").lean();
        const normalUsers = await User.find({ _id: { $in: userIds } }).select("_id name").lean();
        const storeUsers = await Store.find({ _id: { $in: userIds } }).select("_id name").lean();

        // Gabungkan semua hasil pencarian ke dalam satu map (_id -> name)
        const userMap = new Map();
        [...adminUsers, ...vendorUsers, ...normalUsers, ...storeUsers].forEach(user => {
            userMap.set(user._id.toString(), user.name);
        });

        // Format hasil untuk dikirim ke frontend
        const formattedActivities = activities.map(activity => ({
            _id: activity._id,
            user_name: userMap.get(activity.user_id.toString()) || "Unknown", // Ambil nama atau "Unknown"
            action: activity.action,
            created_at: activity.created_at
        }));

        return NextResponse.json({ activities: formattedActivities }, { status: 200 });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
