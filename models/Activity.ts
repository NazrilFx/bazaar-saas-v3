import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStore extends Document {
  vendor_id: mongoose.Types.ObjectId; // Referensi ke vendor
  password_hash: string;
  action: string;
  created_at: Date;
}

const StoreSchema: Schema<IStore> = new Schema({
  vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Relasi ke vendor
  password_hash: { type: String, required: true },
  action: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Vendor: Model<IStore> = mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);
export default Vendor;
