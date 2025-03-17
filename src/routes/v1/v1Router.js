
import express from 'express';

import userRouter from './users.js';
import taskRouter from './tasks.js';


const router = express.Router();

router.use('/users', userRouter);
router.use('/tasks', taskRouter);

export default router;
