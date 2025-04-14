import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Store from "@/models/Store";
import Product from "@/models/Product";
import Event from "@/models/Event";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const today = new Date();

        const token = req.cookies.get("vendor_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded === "string" || !decoded.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const vendorId = decoded.id;

        const activeEvents = await Event.find({
            start_date: { $lte: today },
            end_date: { $gte: today },
        }).lean();

        const stores = await Store.find({ vendor_id: vendorId }).lean();
        const storeIds = stores.map((store) => store._id);
        const productCounts = await Product.aggregate([
            { $match: { store_id: { $in: storeIds } } },
            {
                $group: {
                    _id: "$store_id",
                    count: { $sum: 1 },
                },
            },
        ]);
        const productCountMap = new Map<string, number>();
        productCounts.forEach(({ _id, count }) => {
            productCountMap.set(_id.toString(), count);
        });

        const orders = await Order.find({
            status: "paid",
            store_id: { $in: storeIds },
        }).lean();

        const storesWithBazar = stores.map((store) => {
            const storeIdStr = store._id.toString();

            // Cari event yang memiliki store ini
            const matchingEvent = activeEvents.find(event => {
                // Validasi jika storesId ada dan merupakan array
                if (!Array.isArray(event.storesId)) return false;

                return event.storesId
                    .map((id: any) => id?.toString?.())
                    .includes(storeIdStr);
            });

            const storeOrder = orders.filter((ord) => {
                return ord.store_id.toString() === storeIdStr;
            });

            let revenue
            if (!storeOrder) {
                revenue = 0
            } else {
                revenue = storeOrder.reduce((acc, order) => acc + order.total_amount, 0);
            }

            return {
                ...store,
                bazarEvent: matchingEvent ? matchingEvent.name : "-",
                revenue,
                productCount: productCountMap.get(storeIdStr) || 0,
            };
        });

        return new Response(
            JSON.stringify({
                stores: storesWithBazar,
            }, null, 2),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Failed to fetch vendor dashboard data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
