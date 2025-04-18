import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Store from "@/models/Store";
import Product from "@/models/Product";
import Event from "@/models/Event";
import Order from "@/models/Order";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export interface IEvent {
    name: string;
    description?: string;
    start_date: Date;
    end_date: Date;
    location?: string;
    created_by: string;
    vendorsId?: mongoose.Types.ObjectId[];
    storesId?: mongoose.Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
    storeThisEvent: number;
    isActive: boolean
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const today = new Date();
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

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
            store_id: { $in: storeIds }
        }).lean()

        const storesWithBazar = stores.map((store) => {
            const storeIdStr = store._id.toString();

            // Cari event yang memiliki store ini
            const matchingEvent = activeEvents.find(event => {
                // Validasi jika storesId ada dan merupakan array
                if (!Array.isArray(event.storesId)) return false;

                return event.storesId
                    .map((id: ObjectId) => id?.toString?.())
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

        const storeIdsString = stores.map((store) => store._id.toString());

        // Produk yang dibuat di bulan ini saja
        const totalProducts = await Product.countDocuments({
            store_id: { $in: storeIds },
            created_at: { $gte: startOfThisMonth, $lte: endOfThisMonth },
        });

        // Produk bulan lalu
        const productsLastMonth = await Product.countDocuments({
            store_id: { $in: storeIds },
            created_at: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        });

        // 3 event mendatang dan yang aktif
        const upcomingEvents = await Event.find({
            end_date: { $gte: today }
        })
            .sort({ start_date: 1 })
            .limit(3)
            .lean() as unknown as IEvent[] 

        upcomingEvents.forEach((event) => {
            const typedEvent = event as IEvent;

            const eventStoreIds = typedEvent.storesId?.map((id: ObjectId) => id.toString());
            const storeThisEvent = storeIdsString.filter(id => eventStoreIds?.includes(id)).length;

            typedEvent.storeThisEvent = storeThisEvent;
            typedEvent.isActive = new Date(typedEvent.start_date) <= today;
        });


        // Hitung store vendor yang ikut event
        const storeIdsInEvents = await Event.distinct("storesId", {
            storesId: { $in: storeIds },
        });
        const participatingStoresCount = storeIdsInEvents.length;

        return new Response(
            JSON.stringify({
                stores: storesWithBazar,
                totalProducts,
                productsLastMonth,
                participatingStoresCount,
                upcomingEvents,
                productCounts
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
