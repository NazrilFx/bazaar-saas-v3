import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string
    store_id: mongoose.Types.ObjectId; // Referensi ke store
    vendor_id: mongoose.Types.ObjectId; // Referensi ke vendor
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

const ProductSchema: Schema<IProduct> = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    store_id: { type: Schema.Types.ObjectId, ref: "Store", required: true }, // Relasi ke vendor
    vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Relasi ke vendor    location: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Product: Model<IProduct> = mongoose.models.product || mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
