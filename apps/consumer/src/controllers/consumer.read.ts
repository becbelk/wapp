import { Request, Response } from 'express';
import Consumer from '../consumer.model';

export const getOne = async (req: Request, res: Response) => {
  const { no } = req.body;
  const functionName = 'getOne';
  try {
    if (!no) {
      console.debug(`[DEBUG][consumer_service][${functionName}] Missing 'no' in request body.`);
      return res.status(400).json({ message: `Missing consumer number (no).${no}` });
    }

    const result = await Consumer.findOne({ no });
    console.debug(`[DEBUG][consumer_service][${functionName}] findOne result: ${JSON.stringify(result)}`);

    if (!result) {
      return res.status(404).json({ message: `Consumer with number ${no} not found.` });
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    console.debug(`[DEBUG][consumer_service][${functionName}] error: ${formatError(error)}`);
    return res.status(500).json({ message: 'Server error during getOne.', error: formatError(error) });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const functionName = 'getAll';
  try {
    const result = await Consumer.find();
    console.debug(`[DEBUG][consumer_service][${functionName}] find result count: ${result.length}`);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No consumers found.' });
    }

    return res.status(200).json({ count: result.length, data: result });
  } catch (error) {
    console.debug(`[DEBUG][consumer_service][${functionName}] error: ${formatError(error)}`);
    return res.status(500).json({ message: 'Server error during getAll.', error: formatError(error) });
  }
};

export const getSelection = async (req: Request, res: Response) => {
  const filter = req.body;
  const functionName = 'getSelection';
  try {
    console.debug(`[DEBUG][consumer_service][${functionName}] filter received: ${JSON.stringify(filter)}`);
    const result = await Consumer.find(filter);
    console.debug(`[DEBUG][consumer_service][${functionName}] filter result count: ${result.length}`);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No consumers match the filter.' });
    }

    return res.status(200).json({ count: result.length, data: result });
  } catch (error) {
    console.debug(`[DEBUG][consumer_service][${functionName}] error: ${formatError(error)}`);
    return res.status(500).json({ message: 'Server error during getSelection.', error: formatError(error) });
  }
};

// Helper
function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
