// gateway.router.ts
import { Router } from 'express';
import auth from './middlewares/auth.middleware';
import { home, login ,register,refresh} from './controllers/auth.controller';
import { getAllConsumers,getListConsumers ,getConsumer, createConsumer,deleteConsumer, updateConsumer} from './controllers/consumer.controller';

const router = Router();

router.get('/home', auth, home);
router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);

// ? for  [consumer-service]
router.get('all-consumers',auth,getAllConsumers);
router.get('list-consumers',auth,getListConsumers);
router.get('consumer',auth,getConsumer);


router.post('/create-one',auth,createConsumer);
router.delete('/delete-one/:no',auth,deleteConsumer);
router.post('/update-one/:no',auth,updateConsumer);
export default router;
