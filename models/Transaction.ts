import mongoose, { Document } from "mongoose";

export interface IOrder extends Document {
    order_number: number;
    status: "pending" | "paid" | "cancelled";
    amount: number;
    payment_method: string,
    created_at: Date;
    updated_at: Date   
}

const orderSchema = new mongoose.Schema(
    {
        order_number: { type: Number, required: true, unique: true, default: 0 },
        status: {
            type: String,
            enum: ["pending", "paid", "cancelled"],
            default: "pending",
        },
        amount: { type: Number, required: true },
        Payment_method: { type: String, required: true },
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