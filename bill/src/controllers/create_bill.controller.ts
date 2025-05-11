import { Request, Response } from 'express';
//import Consumption from 
import Bill from '../model/bill.model';
import calculateBillDetails from '../services/billCalculator'; // Assumed external function

const addOne = async (req: Request, res: Response) => {
  try {
    console.log('[DEBUG][billing_service][addOne] Request body received:', req.body);

    const { consumerId, periode, watermeterId, pricingConfigId } = req.body;

    if (!consumerId || !periode || !watermeterId) {
      console.log('[DEBUG][billing_service][addOne] Missing required fields.');
      return res.status(400).json({ error: 'Missing required fields: consumerId, periode, watermeterId.' });
    }

    // Calculate pricing + tax breakdown
    const consumption = await Consumption.findOne({ consumerId, periode, watermeterId });

    if (!consumption) {
      console.log('[DEBUG][billing_service][addOne] No consumption data found.');
      return res.status(404).json({ error: 'Consumption data not found.' });
    }
    
    const billComputation = calculateBillDetails({
      oldConsumption: consumption.oldReading,
      newConsumption: consumption.newReading,
      isFlatRated: consumption.isFlatRated,
      isTaxed: consumption.isTaxed,
    });
    
    if (!billComputation) {
      console.log('[DEBUG][billing_service][addOne] Bill calculation failed.');
      return res.status(400).json({ error: 'Could not compute bill details.' });
    }

    const {
      totalConsumption,
      pricingDetails,
      subTotal,
      taxDetails,
      totalAmount
    } = billComputation;

    const newBill = new Bill({
      consumerId,
      periode,
      watermeterId,
      totalConsumption,
      pricingDetails,
      subTotal,
      taxDetails,
      totalAmount,
      generatedAt: new Date(),
      status: 'unpaid',
      pricingConfigId
    });

    const savedBill = await newBill.save();

    console.log('[DEBUG][billing_service][addOne] Bill successfully created:', savedBill._id);

    return res.status(201).json({ bill: savedBill });

  } catch (err) {
    console.error('[ERROR][billing_service][addOne] Exception occurred:', err);
    return res.status(500).json({ error: 'Internal server error while creating bill.' });
  }
};

export default addOne;
