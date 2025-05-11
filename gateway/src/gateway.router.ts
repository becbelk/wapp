// gateway.router.ts
import { Router } from 'express';
import auth from './middlewares/auth';
import { home, login } from './controllers/home';

const router = Router();

router.get('/home', auth, home);
router.post('/login', login);

export default router;
