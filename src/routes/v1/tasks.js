import express from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../../Controllers/taskController.js';
import { isAuthenticated } from '../../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', isAuthenticated, createTask);
router.get('/getTasks', isAuthenticated, getTasks);
router.put('/update/:id', isAuthenticated, updateTask);
router.delete('/delete/:id', isAuthenticated, deleteTask);

export default router;
