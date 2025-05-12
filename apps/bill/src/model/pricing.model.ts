import mongoose,{Document, Schema} from 'mongoose';



// Interfaces
export interface IPricingTier {
    _id?: string;
    from: number;
    to: number;
    pricePerUnit: number;
    currency?: string;
  }
  
  export interface IPricingConfig extends Document {
    name: string;
    lawDescription: string;
    effectiveFrom: Date;
    approvedBy: string;
    tiers: IPricingTier[];
    createdAt?: Date;
  }
  

// Subschema for PricingTier
const PricingTierSchema = new Schema<IPricingTier>(
    {
      from: { type: Number, required: true },
      to: { type: Number, required: true },
      pricePerUnit: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    { _id: false }
  );
  
  // Main schema for PricingConfig
  const PricingConfigSchema = new Schema<IPricingConfig>(
    {
      name: { type: String, required: true },
      lawDescription: { type: String, required: true },
      effectiveFrom: { type: Date, required: true },
      approvedBy: { type: String, required: true },
      tiers: { type: [PricingTierSchema], required: true },
      createdAt: { type: Date, default: Date.now },
    },
    {
      collection: 'pricing_configs',
    }
  );
  
  const PricingConfig = mongoose.model<IPricingConfig>(
    'PricingConfig',
    PricingConfigSchema
  );
  
  export default PricingConfig;