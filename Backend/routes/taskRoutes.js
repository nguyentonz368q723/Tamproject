const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');
const Task = require('../models/Taskt');

router.get('/test',auth, (req, res) => {
    res.json({
        message: 'Task routes are working!',
        user: req.user
    });
});

//create a task
//create a task
router.post('/add', async (req, res) => {
    try {
        console.log(req.body.taskDescription);
        if (!req.body.taskDescription) {
            console.log('Description is required.');
            return res.status(400).json({ error: "Description is required." });
        }

        const task = new Task({
            description: req.body.taskDescription,
            completed: req.body.completed,
            owner: req.body.owner,
        });

        const newTask = await task.save();
        console.log('Task created successfully:', newTask);

        // res.status(201).json({ task: newTask, message: "Task Created Successfully" });
        const tasks = await Task.find({});
        res.json({ tasks: tasks});
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(400).send({ error: err });
    }
});

router.get('/viewall', async (req, res) => {
    try {
        console.log("Loading");
        const tasks = await Task.find({});
        console.log('task does not exist', tasks);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send({ error: 'Error fetching tasks' });
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

// router.get('/view-tasks', async (req, res) => {
//     try {
//         console.log("New Task");
//         const tasks = await Task.find({});
//         console.log('task does not exist', tasks);
//         // res.render('tasks', { tasks });
//         res.json(tasks);
        
//     } catch (error) {
//         console.error('Error fetching tasks:', error);
//         res.status(500).send({ error: 'Error fetching tasks' });
//     }
// });

module.exports = router;