import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Vendor from "@/models/Vendor";
import Activity from "@/models/Activity";
import Admin from "@/models/Admin";
import User from "@/models/User";
import Store from "@/models/Store";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

    const activeEvents = await Event.countDocuments({
      start_date: { $lte: today },
      end_date: { $gte: today },
    });

    const upcomingEvents = await Event.countDocuments({
      start_date: { $gte: today },
    });

    // Ambil event terdekat yang akan datang
    const nextEvent = await Event.findOne({
      start_date: { $gte: today },
    })
      .sort({ start_date: 1 }) // ambil yang paling dekat
      .lean();

    let daysUntil = null;

    if (nextEvent) {
      const startDate = new Date(nextEvent.start_date);
      const diffTime = startDate.getTime() - today.getTime();
      daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Konversi ke hari
    }

    // Total User Count
    const [vendorCountLastMonth, storeCountLastMonth, userCountLastMonth] = await Promise.all([
      Vendor.countDocuments({
        created_at: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }),
      Store.countDocuments({
        created_at: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }),
      User.countDocuments({
        created_at: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }),
    ]);
    const totalUsersLastMonth = vendorCountLastMonth + storeCountLastMonth + userCountLastMonth;

    // Total User Count
    const [vendorCount, storeCount, userCount] = await Promise.all([
      Vendor.countDocuments({
        created_at: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      Store.countDocuments({
        created_at: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      User.countDocuments({
        created_at: { $gte: startOfMonth, $lte: endOfMonth },
      }),
    ]);
    const totalUsers = vendorCount + storeCount + userCount;

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
    const recentActivity = activities.map(activity => ({
      _id: activity._id,
      user_name: userMap.get(activity.user_id.toString()) || "Unknown", // Ambil nama atau "Unknown"
      action: activity.action,
      created_at: activity.created_at
    }));


    // Ambil vendor yang "active" bernilai false
    const inactiveVendors = await Vendor.find({ verified: false }).lean();
    const activeVendors = await Vendor.find({ verified: true }).lean();
    const activeVendorsLastMonth = await Vendor.countDocuments({
      verified: true,
      created_at: {
        $gte: startOfLastMonth,
        $lte: endOfLastMonth,
      },
    });
    return new Response(
      JSON.stringify({ inactiveVendors, activeVendors, recentActivity, totalUsers, activeEvents, upcomingEvents, daysUntil, totalUsersLastMonth, activeVendorsLastMonth }, null, 2),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
