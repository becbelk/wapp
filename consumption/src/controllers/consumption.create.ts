import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import Consumption from '../consumption.model';
import { CreateConsumptionDto } from '../consumption.dto';

export const createConsumption = async (req: Request, res: Response) => {
  try {
    const dto = plainToInstance(CreateConsumptionDto, req.body);

    const consumption = await Consumption.create(dto);
  return  res.status(201).json(consumption);
  } catch (error) {
  return  res.status(500).json({ message: 'Failed to create consumption', error });
  }
};