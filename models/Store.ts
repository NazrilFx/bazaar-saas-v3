import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStore extends Document {
  name: string;
  description: string;
  vendor_id: mongoose.Types.ObjectId; // Referensi ke vendor
  location: string;
  profile_image: string;
  password_hash: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const StoreSchema: Schema<IStore> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  vendor_id: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Relasi ke vendor
  password_hash: { type: String, required: true },
  location: { type: String, required: true },
  profile_image: { type: String, required: false, default: "" },
  active: {type: Boolean, default: false},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Vendor: Model<IStore> = mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);
export default Vendor;
