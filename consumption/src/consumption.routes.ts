// CRUD
//create/insert consuer read readall update delete
import Router from 'express';
import { createConsumption } from './controllers/consumption.create';
import { getAllConsumptions, getConsumption } from './controllers/consumption.read';
import { updateConsumption } from './controllers/consumption.update';
import { deleteConsumption } from './controllers/consumption.delete';


const router=Router();
router.get('/get-consumption',getConsumption)//1 consumer
router.get('/get-all',getAllConsumptions)
router.post('/insert',createConsumption);
router.delete('/delete-one',deleteConsumption);
router.put('/update',updateConsumption);
export default router;