import { Request, Response } from 'express';
import Consumer from '../consumer.model';
import { ConsumerDto } from '../dto/consumer.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const createConsumer = async (req: Request, res: Response) => {
  const functionName = 'createConsumer';
  const dto = plainToInstance(ConsumerDto, req.body);
  const errors = await validate(dto);
  console.debug(`[DEBUG][consumer_service][${functionName}] dto: ${dto} of ${req.body}`);
  if (errors.length > 0) {
    console.debug(
      `[DEBUG][consumer_service][${functionName}] dto: ${errors}`
    );

    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const consumer = new Consumer(dto);
    const result = await consumer.save();
    console.debug(
      `[DEBUG][consumer_service][${functionName}] saved succefullt!`
    );

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
