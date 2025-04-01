import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStore extends Document {
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

const StoreSchema: Schema<IStore> = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Vendor: Model<IStore> = mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);
export default Vendor;
