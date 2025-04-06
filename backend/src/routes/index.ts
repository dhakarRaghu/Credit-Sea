import express from 'express';
import { userRoutes } from './User';

import { userLogin, userSignup } from '../controlleres/loginUser';
import { authenticateToken } from '../middlewares/mid_check';
  


const appRouter = express.Router();

appRouter.post('/login', userLogin);
appRouter.post('/signup' , userSignup);

appRouter.use('/user', authenticateToken, userRoutes);


export { appRouter };