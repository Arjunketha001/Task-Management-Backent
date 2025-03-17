import Task from "../Schema/task.js";
import { cacheGet, cacheSet } from "../utils/cache.js";

export const createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.userId });
  return res.status(201).json(task);
};


export const getTasks = async (req, res) => {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const cacheKey = `${req.userId}-${status}-${priority}-${page}`;
  
    // Check cache first
    const cachedData = cacheGet(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }
  
    const query = { userId: req.userId };
    if (status) query.status = status;
    if (priority) query.priority = priority;
  
    const tasks = await Task.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
  
    // Store in cache
    cacheSet(cacheKey, tasks);
  
    res.status(200).json(tasks);
};

export const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
  
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedTask);
  };
  
export const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    return res.status(204).json({ message: 'Task Successfully Deleted' });
};
  