import Task from "../Schema/task.js";
import { cacheGet, cacheSet } from "../utils/cache.js";
import { taskQueue } from "../utils/priorityQueue.js";

export const createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.userId });
  taskQueue.enqueue({
    id: task._id,
    priority: task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1,
    createdAt: task.createdAt
  });

  return res.status(201).json(task);
};


export const getTasks = async (req, res) => {
    const { page = 1, limit = 10, status, priority } = req.query;
  
    // Geting  all tasks from the priority queue (already sorted)
    let tasks = taskQueue.getTasks(0, taskQueue.size());
  
    // Apply status and priority filters
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (priority) {
      const priorityMap = { low: 1, medium: 2, high: 3 };
      tasks = tasks.filter(task => task.priority === priorityMap[priority]);
    }

    // Pagination AFTER filtering
    const start = (page - 1) * limit;
    const end = start + Number(limit);
    const paginatedTasks = tasks.slice(start, end);
  
    res.status(200).json(paginatedTasks);
  };
  


export const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
 
  
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    taskQueue.updateTask({
        id: task._id,
        priority: task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1,
        createdAt: task.createdAt
      });

    return res.status(200).json(updatedTask);
  };
  
export const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    taskQueue.removeTask(req.params.id);

    return res.status(204).json({ message: 'Task Successfully Deleted' });
};
  