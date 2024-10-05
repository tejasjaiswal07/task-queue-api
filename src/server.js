const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const Redis = require('ioredis');
const { PORT, REDIS_URL } = require('./config');
const taskRoutes = require('./routes/taskRoutes');
const logger = require('./utils/logger');

if (cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`);


  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

  
  const taskQueue = new Redis(REDIS_URL);
  const taskService = require('./services/taskService');

  setInterval(async () => {
    try {
      const nextTask = await taskQueue.lpop('tasks');
      if (nextTask) {
        const { user_id } = JSON.parse(nextTask);
        await taskService.processTask(user_id);
      }
    } catch (error) {
      logger.error('Error processing task from queue:', error);
    }
  }, 1000); 

} else {
  const app = express();
  
  app.use(express.json());
  app.use('/api/v1', taskRoutes);

  
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(PORT, () => {
    logger.info(`Worker ${process.pid} started on port ${PORT}`);
  });
}