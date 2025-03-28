import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  role: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema<IAdmin> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Admin: Model<IAdmin> = mongoose.models.User || mongoose.model<IAdmin>("Admin", UserSchema);
export default Admin;
