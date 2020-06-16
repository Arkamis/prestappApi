import { 
    logout, 
    authenticateUser, 
    registerUser, 
    me,
    verifyEmail
} from './user.controller';
import { Router } from 'express';
import { protect } from '../../utils/auth';

const router = Router();

//here we declare routes, remeber REST ARQ
router.post('/register', registerUser);
router.post('/login', authenticateUser);

router.get('/logout',protect, logout);
router.get('/me', protect, me);
router.get('/confirmation/:token', verifyEmail);

export default router;