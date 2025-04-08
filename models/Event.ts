import mongoose, { Document, Schema, Model } from 'mongoose';

// 1. Interface untuk TypeScript
export interface IEvent extends Document {
  name: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  location?: string;
  created_by: string;
  vendorsId?: mongoose.Types.ObjectId[];
  storesId?: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

// 2. Schema Definition
const EventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    vendorsId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vendor', // Sesuaikan dengan nama collection yang kamu pakai
      },
    ],
    storesId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Store', // Sesuaikan juga dengan nama collectionnya
      },
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
);

EventSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

const Product: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Product;
