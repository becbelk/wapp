import { Request, Response } from 'express';
import Consumption from '../consumption.model';
import {plainToInstance} from 'class-transformer';
import { ConsumptionDto } from '../consumption.dto';
export const deleteConsumption = async (req: Request, res: Response) => {
  try {
    const watermeter = req.query.watermeter;
    const dto = plainToInstance(ConsumptionDto, req.body);//? UpdateConsumptionDto has the same structure as deletion
    if (watermeter) {
      const deletion = await Consumption.deleteOne(
        {watermeter,...dto}
      );
      if (!deletion) {
        return res.status(404).json({ message: 'Consumption not found' });
      }
      return res
        .status(200)
        .json({ message: 'Consumption deleted successfully' });
    } else {
      console.debug(`[DEBUG][][]`);
      return res.status(500).json({ message: 'no id used' });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error deleting consumption', error });
  }
};
