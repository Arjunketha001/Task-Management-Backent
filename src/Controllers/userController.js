import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../Schema/user.js';
import { JWT_SECRET } from '../Config/serverConfig.js';
import Task from '../Schema/task.js';
import { taskQueue } from '../utils/priorityQueue.js';

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.create({ username, email, password });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

  return res.status(201).json({ user, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    console.log("user login", user.username);

    const tasks = await Task.find({ userId: user._id });
    tasks.forEach((task) =>
        taskQueue.enqueue({
        id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1,
        createdAt: task.createdAt,
        status: task.status
        })
    );

    console.log("tasks are loaded into queue",taskQueue);
    
    
  return res.status(200).json({ user, token });
};
