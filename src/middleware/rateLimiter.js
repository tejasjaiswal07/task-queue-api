const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');
const { REDIS_URL } = require('../config');

const redis = new Redis(REDIS_URL);

const minuteLimiter = RateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate_limit:minute:',
    expiry: 60, 
  }),
  windowMs: 60 * 1000,
  max: 20, 
  keyGenerator: (req) => req.body.user_id,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests, task queued for later execution',
    });
  },
});

const secondLimiter = RateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rate_limit:second:',
    expiry: 1, 
  }),
  windowMs: 1000,
  max: 1, 
  keyGenerator: (req) => req.body.user_id,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests, task queued for later execution',
    });
  },
});

module.exports = [minuteLimiter, secondLimiter];
