import { Request, Response } from 'express';
import Consumer from '../consumer.model';

export const softDeleteConsumer = async (req: Request, res: Response) => {
  const { no } = req.params;
  const functionName = 'softDeleteConsumer';
  console.debug(`[DEBUG][consumer_service][${functionName}] no=[${no}] `);

  try {
    if (!no) {
      return res.status(400).json({ message: 'Missing required path [no]' });
    }

    const deleted = await Consumer.findOneAndUpdate(
      { no },
      { $set: { deleted: true } },
      { new: true }
    );
    if (!deleted) {
      return res
        .status(404)
        .json({
          message: 'Consumer with this number does not exist.',
        });
    }

    return res.status(200).json({
      message: `Consumer no: ${no} was successfully softly deleted.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'An error occurred while deleting the consumer.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
