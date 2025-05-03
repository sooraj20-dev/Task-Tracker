const Task = require('../models/Task');

// Create new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;

        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            status
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
