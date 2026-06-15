const redis = require("../config/redis");

const rateLimiter = (maxRequests = 10, windowSeconds = 60) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const key = `rate_limit:${ip}`;

      const requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (requests > maxRequests) {
        return res.status(429).json({
          message: `Too many requests. Please try again after ${windowSeconds} seconds.`,
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err.message);
      next();
    }
  };
};

module.exports = rateLimiter;
