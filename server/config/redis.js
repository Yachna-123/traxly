let redis = null;

try {
  const Redis = require("ioredis");
  
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
  } else if (process.env.REDIS_HOST) {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT || 6379,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
    });
  } else {
    console.log("No Redis config found - running without cache");
  }

  if (redis) {
    redis.on("connect", () => console.log("Redis connected"));
    redis.on("error", (err) => {
      console.error("Redis error:", err.message);
      redis = null;
    });
  }
} catch (e) {
  console.error("Redis init failed:", e.message);
  redis = null;
}

const safeDel = async (key) => {
  if (!redis) return;
  try { await redis.del(key); } catch (e) { console.error("Redis safeDel failed:", e.message); }
};

module.exports = { redis, safeDel };
