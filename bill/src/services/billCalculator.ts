interface PricingTier {
    edge: number;
    price: number;
    tax: number;
    difference: number;
    index: number;
  }
  
  interface ConsumptionInput {
    oldConsumption: number;
    newConsumption: number;
    isFlatRated: boolean;
    isTaxed?: boolean;
  }
  
  interface BillComputationResult {
    oldC: number;
    newC: number;
    diff: number;
    edges: number[];
    amounts: number[];
    taxes: number[];
    totalTaxes: number;
    totalAmounts: number;
    totalToPay: number;
    flatRateAmount: number;
    inscriptionTax: number;
  }
  
  const defaultPricingConfig = {
    levelAmountTable: [
      { edge: 100, price: 6.3, tax: 2.35, difference: 100, index: 1 },
      { edge: 220, price: 20.48, tax: 7.64, difference: 120, index: 2 },
      { edge: 328, price: 34.65, tax: 12.93, difference: 108, index: 3 },
      { edge: 100000000, price: 40.95, tax: 15.28, difference: 0, index: 4 },
    ] as PricingTier[],
    inscriptionTax: 200,
    flatRateAmount: 5000,
  };
  
  function handleFlatRate(): BillComputationResult {
    return {
      oldC: 0,
      newC: 0,
      flatRateAmount: defaultPricingConfig.flatRateAmount,
      diff: 0,
      edges: [0, 0, 0, 0],
      amounts: [0, 0, 0, 0],
      taxes: [0, 0, 0, 0],
      inscriptionTax: 0,
      totalTaxes: 0,
      totalAmounts: defaultPricingConfig.flatRateAmount,
      totalToPay: defaultPricingConfig.flatRateAmount,
    };
  }
  
  export function calculateBillDetails(consumptions: ConsumptionInput): BillComputationResult {
    if (consumptions.isFlatRated) return handleFlatRate();
  
    const totalConsumption = consumptions.newConsumption - consumptions.oldConsumption;
    const invoice: BillComputationResult = {
      oldC: consumptions.oldConsumption,
      newC: consumptions.newConsumption,
      diff: totalConsumption,
      edges: [0, 0, 0, 0],
      amounts: [0, 0, 0, 0],
      taxes: [0, 0, 0, 0],
      flatRateAmount: 0,
      inscriptionTax: defaultPricingConfig.inscriptionTax,
      totalTaxes: 0,
      totalAmounts: 0,
      totalToPay: 0,
    };
  
    let consumed = totalConsumption;
    let previousEdge = 0;
  
    for (let i = 0; i < defaultPricingConfig.levelAmountTable.length; i++) {
      const tier = defaultPricingConfig.levelAmountTable[i];
  
      const applicableUnits = Math.min(consumed, tier.edge - previousEdge);
      invoice.edges[i] = applicableUnits;
  
      const amount = applicableUnits * tier.price;
      const tax = consumptions.isTaxed ? applicableUnits * tier.tax : 0;
  
      invoice.amounts[i] = amount;
      invoice.taxes[i] = tax;
  
      invoice.totalAmounts += amount;
      invoice.totalTaxes += tax;
  
      if (consumed <= tier.edge) break;
  
      consumed -= applicableUnits;
      previousEdge = tier.edge;
    }
  
    invoice.totalToPay = invoice.totalAmounts + invoice.totalTaxes + invoice.inscriptionTax;
  
    return invoice;
  }
  
  export default calculateBillDetails;
  