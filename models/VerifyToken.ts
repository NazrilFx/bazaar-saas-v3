import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerifyToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const VerifyTokenSchema: Schema<IVerifyToken> = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const VerifyToken: Model<IVerifyToken> =
  mongoose.models.VerifyToken || mongoose.model<IVerifyToken>("VerifyToken", VerifyTokenSchema);
export default VerifyToken;
