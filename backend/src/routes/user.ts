import { Router } from 'express';

const userRoutes = Router();

userRoutes.post('/', ShowuserDetails);
userRoutes.post('/payment', UserPayment);

export { userRoutes };