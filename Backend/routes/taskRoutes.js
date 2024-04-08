const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Task = require('../models/Taskt'); 

// Test endpoint
router.get('/test', auth, (req, res) => {
    res.json({
        message: 'Task routes are working!',
        user: req.user
    });
});

// Add a new task
router.post('/add', auth, async (req, res) => {
    try {
        const { taskDescription } = req.body;
     
        if (!taskDescription) {
            return res.status(400).json({ error: "Description is required." });
        }
        const task = new Task({
            description: taskDescription,
            owner: req.user._id 
        });

        const newTask = await task.save();

        res.status(201).json({ task: newTask, message: "Task Created Successfully" });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: "Failed to create task." });
    }
});


// View all tasks with pagination and optional search
router.get('/viewall', async (req, res) => {
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
});

// get user tasks
router.get('/', auth, async (req, res) => {
    try{
        const tasks = await Task.find({
            owner: req.user._id
        })
        res.status(200).json({tasks, count: tasks.length, message: "Tasks Fetched Successfully"});
    }
    catch(err){
        res.status(500).send({error: err});
    }
});


//fetch a task by id

router.get('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;

    try{
        const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id
        });
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json({task, message: "Task Fetched Successfully"});
    }
    catch(err){
        res.status(500).send({error: err});
    }
})

// update a task by id   -   description , completed
router.patch('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['taskDescription', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).json({error: "Invalid Updates"});
    }

    try{
      const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id
      });

        if(!task){
            return res.status(404).json({message: "Task not found"});
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json({
            message: "Task Updated Successfully",
        })
    }
    catch(err){
        res.status(500).send({error: err});
    }
})


// delete a task by id
router.delete('/:id', auth , async (req,res)=>{
    const taskid = req.params.id;

    try{
        const task = await Task.findOneAndDelete({
            _id: taskid,
            owner: req.user._id
        });
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        const tasks = await Task.find({ owner: req.user._id });
        res.status(200).json({task, message: "Task Deleted Successfully"});
    }
    catch(err){
        res.status(500).send({error: err});
    }
})


module.exports = router;