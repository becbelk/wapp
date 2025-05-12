import { Request, Response } from 'express';
import Bill from '../model/bill.model';

const getOne = async (req: Request, res: Response) => {
  try {
    const { periode, watermeterId } = req.body;

    // Validate inputs
    if (!periode || !watermeterId) {
      console.log('[debug][billing_service][getOne] Missing periode or watermeterId');
      return res.status(400).json({ error: 'Missing required fields: periode and watermeterId' });
    }

    console.log('[debug][billing_service][getOne] Searching for bill with', { periode, watermeterId });

    const found = await Bill.findOne({ periode, watermeterId });

    if (found) {
      console.log('[debug][billing_service][getOne] Bill found:', found._id);
      return res.status(200).json({ bill: found });
    }

    console.log('[debug][billing_service][getOne] No bill found for', { periode, watermeterId });
    return res.status(404).json({ error: `Bill not found for periode: ${periode}, watermeterId: ${watermeterId}` });

  } catch (err) {
    console.error('[error][billing_service][getOne] Exception occurred:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default getOne;
