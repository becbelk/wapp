

import { Request, Response } from 'express';
import Consumption from '../consumption.model';

export const getAllConsumptions = async (_req: Request, res: Response) => {
    try {
      const consumptions = await Consumption.find();
      return res.status(200).json(consumptions);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve consumptions', error });
    }
  };
  
  export const getConsumption = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const consumption = await Consumption.findById(id);
      if(id){
      if (!consumption) {
        return res.status(404).json({ message: 'Consumption not found' });
      }
   return   res.status(200).json(consumption);}
      else{
        console.debug(`[][][]`)
      return res.status(500).json({ message: 'no id defined' });

      }
    } catch (error) {
    return  res.status(500).json({ message: 'Error retrieving consumption', error });
    }
  };
  