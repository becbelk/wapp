import { Request, Response } from 'express';
import Bill from '../model/bill.model';

const getAll = async (req: Request, res: Response) => {
  try {
    const periode=req.params;//suppose that the request is /periode=
    console.log('[DEBUG][billing_service][getAll] Fetching all bills...');

    const bills = await Bill.find({periode});

    console.log(`[DEBUG][billing_service][getAll] Found ${bills.length} bill(s).`);

    return res.status(200).json({ bills });

  } catch (err) {
    console.error('[ERROR][billing_service][getAll] Exception occurred:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default getAll;
