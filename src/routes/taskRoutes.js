const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const { REDIS_URL } = require('../config');
const rateLimiter = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

const taskQueue = new Redis(REDIS_URL);

router.post('/task', rateLimiter, async (req, res) => {
  console.log('Received request body:', req.body);  // Add this line
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    await taskQueue.rpush('tasks', JSON.stringify({ user_id }));
    logger.info(`Task queued for user: ${user_id}`);
    res.status(202).json({ message: 'Task queued successfully' });
  } catch (error) {
    logger.error('Error queueing task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;