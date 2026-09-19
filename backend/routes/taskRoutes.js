const express = require('express');
const router = express.Router();
const {
  getTasks,
  getUpcomingTasks,
  createTask,
  toggleTaskStatus,
  deleteTask,
} = require('../controllers/taskController');

router.route('/upcoming')
  .get(getUpcomingTasks);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id/toggle')
  .patch(toggleTaskStatus);

router.route('/:id')
  .delete(deleteTask);

module.exports = router;
