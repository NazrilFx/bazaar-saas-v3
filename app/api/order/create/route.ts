import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order"; // sesuaikan path import model Order
import mongoose from "mongoose";
import Activity from "@/models/Activity";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            customer_name,
            customer_email,
            items,
            total_amount,
            tax_amount,
            status,
            midtrans_token,
            payment_method,
            store_id
        } = body;

        const storeObjectId = new mongoose.Types.ObjectId(store_id);

        // Validasi item
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: "Order items are required." }, { status: 400 });
        }

        // Hitung order_number otomatis
        const lastOrder = await Order.findOne().sort({ order_number: -1 });
        const nextOrderNumber = lastOrder ? lastOrder.order_number + 1 : 1;
        const itemsWithSubtotal = items.map((product) => ({
            ...product,
            product_id: new mongoose.Types.ObjectId(product.id),
            subtotal: product.quantity * product.price
        }))

        const newOrder = new Order({
            store_id: storeObjectId,
            customer_name,
            customer_email,
            order_number: nextOrderNumber,
            items: itemsWithSubtotal,
            midtrans_token,
            total_amount,
            status,
            tax_amount,
            payment_method,
            created_at: new Date(),
            updated_at: new Date(),
        });

        await newOrder.save();

        const newActivity = new Activity({
            user_id: store_id,
            user_role: "store",
            action: `${customer_name} user / store order ${items.length} items with a total of ${total_amount}`,
            created_at: new Date(),
        })

        await newActivity.save()


        return NextResponse.json({ message: "Order created", order: newOrder }, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
}
