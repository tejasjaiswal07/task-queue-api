const logger = require('../utils/logger');

async function processTask(user_id) {
  const logMessage = `${user_id}-task completed at-${Date.now()}`;
  logger.info(logMessage);
}

module.exports = {
  processTask
};

