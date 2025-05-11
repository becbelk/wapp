import { Schema, model, Document } from 'mongoose';

export interface ConsumptionUpdate {
  date: Date;
  userId: string;
}

export interface IConsumption extends Document {
  watermeter: string;
  periode: string;
  oldConsumption: number;
  newConsumption: number;
  updates: ConsumptionUpdate[];
  dataHash: string;
}

const updateSchema = new Schema<ConsumptionUpdate>({
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

const consumptionSchema = new Schema<IConsumption>({
  watermeter: { type: String, unique: true, required: true },
  periode: { type: String, required: true },
  oldConsumption: { type: Number, required: true, default: 0 },
  newConsumption: { type: Number, default: 0 },
  updates: [updateSchema],
  dataHash: { type: String, default: '0' },
});

const Consumption = model<IConsumption>('Consumption', consumptionSchema,'water_consumptions');
export default Consumption;