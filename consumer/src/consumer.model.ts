import mongoose, { Document, Schema } from 'mongoose';

export interface IConsumer extends Document {
  no: string;
  name: string;
  address: string;
  watermeter: string;
  deleted: boolean;
  dataHash: string;
}

const consumerSchema = new Schema<IConsumer>(
  {
    no: { type: String, unique: true, required: true },
    name: { type: String, required: true, index: true },
    address: { type: String, required: true, index: true },
    watermeter: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    dataHash: { type: String, default: "0" },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

consumerSchema.index({ name: "text", address: "text" });

const Consumer = mongoose.model<IConsumer>("Consumer", consumerSchema, "water_consumers");

export default Consumer;
