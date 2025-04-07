import { Router } from 'express';
import { getAllUsers, updateLoanStatus } from '../controllers/admin';

const adminRoutes = Router();

adminRoutes.get('/', getAllUsers);
adminRoutes.put("/:id", updateLoanStatus );

export { adminRoutes };

