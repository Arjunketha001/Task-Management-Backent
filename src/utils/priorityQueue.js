class PriorityQueue {
  constructor() {
    this.queue = [];
    this.taskMap = new Map(); // ✅ Keep track of task IDs to avoid duplicates
  }

  enqueue(task) {
    if (this.taskMap.has(task.id)) return; // ✅ Prevent duplicate insertion

    this.queue.push(task);
    this.taskMap.set(task.id, task);
    this._heapifyUp();
  }

  dequeue() {
    if (this.queue.length === 0) return null;
    const root = this.queue[0];
    const last = this.queue.pop();
    if (this.queue.length > 0) {
      this.queue[0] = last;
      this._heapifyDown();
    }
    this.taskMap.delete(root.id); //  Remove from map
    return root;
  }

  updateTask(updatedTask) {
    const index = this.queue.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.queue[index] = updatedTask;
      this._heapifyUp(index);
      this._heapifyDown(index);
      this.taskMap.set(updatedTask.id, updatedTask); //  Update map
    }
  }

  removeTask(taskId) {
    const index = this.queue.findIndex(task => task.id === taskId);
    if (index !== -1) {
      const last = this.queue.pop();
      if (index < this.queue.length) {
        this.queue[index] = last;
        this._heapifyUp(index);
        this._heapifyDown(index);
      }
      this.taskMap.delete(taskId); //  Remove from map
    }
  }

  getTasks(start, end) {
    return this.queue.slice(start, end);
  }

  size() {
    return this.queue.length;
  }

  _heapifyUp(index = this.queue.length - 1) {
    let currentIndex = index;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this._compare(this.queue[currentIndex], this.queue[parentIndex]) < 0) {
        [this.queue[currentIndex], this.queue[parentIndex]] =
          [this.queue[parentIndex], this.queue[currentIndex]];
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  _heapifyDown(index = 0) {
    let currentIndex = index;
    const length = this.queue.length;
    while (true) {
      let leftChild = 2 * currentIndex + 1;
      let rightChild = 2 * currentIndex + 2;
      let smallest = currentIndex;

      if (leftChild < length && this._compare(this.queue[leftChild], this.queue[smallest]) < 0) {
        smallest = leftChild;
      }
      if (rightChild < length && this._compare(this.queue[rightChild], this.queue[smallest]) < 0) {
        smallest = rightChild;
      }
      if (smallest !== currentIndex) {
        [this.queue[currentIndex], this.queue[smallest]] =
          [this.queue[smallest], this.queue[currentIndex]];
        currentIndex = smallest;
      } else {
        break;
      }
    }
  }

  _compare(a, b) {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.createdAt - b.createdAt;
  }
}

export const taskQueue = new PriorityQueue();
