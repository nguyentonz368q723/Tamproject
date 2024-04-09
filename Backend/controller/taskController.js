const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { response } = require('express');

// taskController.js
const Task = require('../models/Taskt')

// Add a new task
exports.addTask = async (req, res) => {
    try {
        const { taskDescription, owner_id } = req.body;

        if (!taskDescription) {
            return res.status(400).json({ error: "Description is required." });
        }

        const task = new Task({
            description: taskDescription,
            owner: owner_id
        });

        const newTask = await task.save();

        res.status(201).json({ task: newTask, message: "Task Created Successfully" });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: "Failed to create task." });
    }
};

// View all tasks with pagination and optional search
exports.viewAllTasks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    let matchQuery = {};
    if (search) {
        matchQuery.description = { $regex: search, $options: 'i' }; 
    }

    try {
        const tasks = await Task.find(matchQuery)
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);
        
        const totalCount = await Task.countDocuments(matchQuery);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            tasks,
            pageInfo: {
                currentPage: page,
                totalPages,
                totalCount,
                limit
            }
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get user tasks
exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            owner: req.user._id
        });
        res.status(200).json({ tasks, count: tasks.length, message: "Tasks Fetched Successfully" });
    } catch (err) {
        res.status(500).send({ error: err });
    }
};

// Fetch a task by id
exports.getTaskById = async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await Task.findOne({
            _id: taskId,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ task, message: "Task Fetched Successfully" });
    } catch (err) {
        res.status(500).send({ error: err });
    }
};

// Update a task by id (description, completed)
exports.updateTaskById = async (req, res) => {
    const taskId = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid Updates" });
    }

    try {
        const task = await Task.findOne({
            _id: taskId,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json({
            message: "Task Updated Successfully",
        });
    } catch (err) {
        res.status(500).send({ error: err });
    }
};

// Delete a task by id
exports.deleteTaskById = async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await Task.findOneAndDelete({
            _id: taskId,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const tasks = await Task.find({ owner: req.user._id });
        res.status(200).json({ task, message: "Task Deleted Successfully" });
    } catch (err) {
        res.status(500).send({ error: err });
    }
};
