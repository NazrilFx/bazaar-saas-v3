import mongoose, { Document } from "mongoose";

export interface IOrderItem {
    product_id: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface IOrder extends Document {
    midtrans_token: string
    customer_name: string;
    customer_email: string;
    order_number: number;
    status: "pending" | "paid" | "cancelled";
    items: IOrderItem[];
    total_amount: number;
    tax_amount: number;
    payment_method: string,
    created_at: Date;
    updated_at: Date
}

const orderItemSchema = new mongoose.Schema(
    {
        product_id: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        midtrans_token: { type: String, required: true },
        customer_name: { type: String, required: true },
        customer_email: { type: String, required: true },
        order_number: { type: Number, required: true, unique: true, default: 0 },
        status: {
            type: String,
            enum: ["pending", "paid", "cancelled"],
            default: "pending",
        },
        items: { type: [orderItemSchema], required: true },
        total_amount: { type: Number, required: true },
        tax_amount: { type: Number, required: true },
        payment_method: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
);

// Middleware untuk memperbarui `updated_at` setiap kali dokumen diubah
orderSchema.pre("save", function (next) {
    this.updated_at = new Date();
    next();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;