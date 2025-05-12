// CRUD
//create/insert consuer read readall update delete
import Router from 'express';
import  {createConsumer}  from './controllers/consumer.create_one';
import  {softDeleteConsumer} from './controllers/consumer.delete_one';
import { updateConsumer } from './controllers/consumer.update_one';
const router=Router();
router.get('/get-consumer')//1 consumer
router.get('/get-all-consumers')
router.get('/get-list-consumers')
router.post('/insert-one',createConsumer);
router.delete('/delete-one/:no',softDeleteConsumer);
router.post('/update-one/:no',updateConsumer);
export default router;