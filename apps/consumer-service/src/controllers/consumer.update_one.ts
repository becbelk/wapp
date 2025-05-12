import { Request, Response } from 'express';
import Consumer from '../consumer.model';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ConsumerDto } from '../dto/consumer.dto';




export const updateConsumer = async (req: Request, res: Response) => {
  const { no } = req.params;

  const dto = plainToInstance(ConsumerDto, req.body);
  const errors = await validate(dto, { skipMissingProperties: true });

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const updated = await Consumer.findOneAndUpdate(
      { no },
      { $set: dto },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Consumer not found' });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
