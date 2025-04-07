import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  user_id: mongoose.Types.ObjectId;
  user_role: "admin" | "vendor" | "user" | "store"; // Menentukan asal user_id
  action: string;
  created_at: Date;
}

const ActivitySchema: Schema<IActivity> = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true }, // ID user, bisa dari mana saja
  user_role: { type: String, enum: ["admin", "vendor", "store", "user"], required: true }, // Menyimpan asal user_id
  action: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Activity = mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);
export default Activity;
