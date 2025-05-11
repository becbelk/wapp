import { plainToInstance } from 'class-transformer';

import { Request, Response } from 'express';
import Consumption from '../consumption.model';
import { ConsumptionDto } from '../consumption.dto';


export const updateConsumption = async (req: Request, res: Response) => {
    try {
      const watermeter  = req.query.watermeter;
      const dto= plainToInstance(ConsumptionDto,req.body);
      const update = await Consumption.findOneAndUpdate({watermeter}, dto, { new: true });
      if (!update) {
      console.debug(`[DEBUG][consumption][updateConsumption] watermeter: ${watermeter}, value ${dto}`)

        return res.status(404).json({ message: 'Consumption not found' });
      }
      console.debug(`[DEBUG][consumption][updateConsumption] watermeter: ${watermeter}, value ${dto}`)
      return res.status(200).json(update);
    } catch (error) {
    return  res.status(500).json({ message: 'Error updating consumption', error });
    }
  };
  