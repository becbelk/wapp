import mongoose, { Document, Schema } from 'mongoose';

// Interfaces

export interface ITax {
  _id?: string;
  name: string;
  percentage: number;
  isCompound: boolean;
}

export interface IBillPricingDetail {
  from: number;
  to: number;
  units: number;
  pricePerUnit: number;
  cost: number;
}

export interface IBillTaxDetail {
  name: string;
  percentage: number;
  amount: number;
}

export interface IBill extends Document {
  consumptionId: mongoose.Types.ObjectId | string;
  periode: Date;
  totalConsumption: number;
  pricingConfigId: mongoose.Types.ObjectId;
  pricingDetails: IBillPricingDetail[];
  subTotal: number;
  taxDetails: IBillTaxDetail[];
  totalAmount: number;
  generatedAt: Date;
  status: 'paid' | 'unpaid' | 'pending' | 'failed';
}

// Sub-schemas
const BillPricingDetailSchema = new Schema<IBillPricingDetail>(
  {
    from: Number,
    to: Number,
    units: Number,
    pricePerUnit: Number,
    cost: Number,
  },
  { _id: false }
);

const BillTaxDetailSchema = new Schema<IBillTaxDetail>(
  {
    name: String,
    percentage: Number,
    amount: Number,
  },
  { _id: false }
);

// Main schema
const billSchema = new Schema<IBill>({
  consumptionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Consumer',
  },
  periode: { type: Date, required: true },
  totalConsumption: { type: Number, required: true },
  pricingDetails: { type: [BillPricingDetailSchema], required: true },
  subTotal: { type: Number, required: true },
  taxDetails: { type: [BillTaxDetailSchema], required: true },
  totalAmount: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['paid', 'unpaid', 'pending', 'failed'],
    default: 'unpaid',
  },
});

const Bill = mongoose.model<IBill>('Bill', billSchema, 'water_bills');

export default Bill;
