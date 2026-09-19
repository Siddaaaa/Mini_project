const Task = require('../models/Task');
const Pet = require('../models/Pet');

// @desc    Get all tasks with optional filters (status, category, pet)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { status, category, pet } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }

    if (pet && pet !== 'all') {
      filter.pet = pet;
    }

    const tasks = await Task.find(filter)
      .populate('pet', 'name species breed')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message,
    });
  }
};

// @desc    Get upcoming pending tasks (dueDate >= today, populated pet, sorted asc)
// @route   GET /api/tasks/upcoming
const getUpcomingTasks = async (req, res) => {
  try {
    const { category, pet } = req.query;
    
    // Calculate start of today in local/UTC
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const filter = {
      status: 'pending',
      dueDate: { $gte: startOfToday },
    };

    if (category && category !== 'all') {
      filter.category = category.toLowerCase();
    }

    if (pet && pet !== 'all') {
      filter.pet = pet;
    }

    const tasks = await Task.find(filter)
      .populate('pet', 'name species breed')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming tasks',
      error: error.message,
    });
  }
};

// @desc    Create a new task linked to a pet
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, category, dueDate, pet, status } = req.body;

    if (!title || !category || !dueDate || !pet) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, dueDate, and target pet',
      });
    }

    // Verify pet exists
    const existingPet = await Pet.findById(pet);
    if (!existingPet) {
      return res.status(404).json({
        success: false,
        message: 'Selected pet does not exist',
      });
    }

    const task = await Task.create({
      title,
      category: category.toLowerCase(),
      dueDate,
      status: status || 'pending',
      pet,
    });

    const populatedTask = await Task.findById(task._id).populate(
      'pet',
      'name species breed'
    );

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating task',
      error: error.message,
    });
  }
};

// @desc    Toggle task status between 'pending' and 'completed'
// @route   PATCH /api/tasks/:id/toggle
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id ${req.params.id}`,
      });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    const updatedTask = await Task.findById(task._id).populate(
      'pet',
      'name species breed'
    );

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling task status',
      error: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id ${req.params.id}`,
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully',
      deletedTaskId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message,
    });
  }
};

module.exports = {
  getTasks,
  getUpcomingTasks,
  createTask,
  toggleTaskStatus,
  deleteTask,
};
