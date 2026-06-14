const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err.message));

redis.safeDel = async (key) => {
  try { await redis.del(key); } catch (e) { console.error("Redis safeDel failed:", e.message); }
};

module.exports = redis;
