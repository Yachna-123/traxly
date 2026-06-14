const Redis = require("ioredis");

let redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: (times) => {
      if (times > 3) {
        console.error("Redis connection failed after 3 retries");
        return null;
      }
      return Math.min(times * 200, 1000);
    },
  });
}

redis.on("connect", () => { console.log("Redis connected"); });
redis.on("error", (err) => { console.error("Redis error:", err.message); });

// Safe delete - won't crash if Redis is down
redis.safeDel = async (key) => {
  try { await redis.del(key); } catch (e) { console.error("Redis safeDel failed:", e.message); }
};

module.exports = redis;
