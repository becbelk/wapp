import { Router } from 'express';
import {loginWithPassword} from './controllers/login_with_psw.controller';
import {register} from './controllers/register.controller';
import {refreshJWT} from './controllers/refresh_jwt.controller';
import { logout } from './controllers/logout.controller';
import { profile } from 'console';
import { hasAuthority } from './controllers/has_authority.controller';
const router = Router();
router.post('/register', register);
router.post('/login', loginWithPassword);
router.post('/logout', logout);

router.post('/refresh', refreshJWT);
router.get('/profile', profile);
router.get('/has-authority', hasAuthority);

export default router;