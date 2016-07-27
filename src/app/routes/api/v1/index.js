import express from 'express';

import authMiddleware from '../../../middlewares/auth';
import usersRoutes from './users';

const router = express.Router();

// route middleware
router.use(authMiddleware);

router.use('/users', usersRoutes)

export default router;