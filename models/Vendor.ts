import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IVendor extends Document {
  status: string;
  _id: Types.ObjectId;  // Pastikan `_id` dideklarasikan dengan tipe ObjectId
  name: string;
  email: string;
  description: string;
  phone: string;
  profile_image: string;
  business_type: string;
  contact_name: string;
  password_hash: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const VendorSchema: Schema<IVendor> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  password_hash: { type: String, required: true },
  phone: { type: String, required: false },
  profile_image: { type: String, required: false, default: "" },
  business_type: {type: String, required: true},
  contact_name: {type: String, required: true},
  verified: {type: Boolean, default: false},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Vendor: Model<IVendor> = mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema);
export default Vendor;
