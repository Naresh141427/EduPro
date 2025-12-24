const Redis = require("ioredis");
const env = require("./env");

const redis = new Redis({
  host: env.REDIS.HOST || "127.0.0.1",
  port: env.REDIS.PORT || 6379,
  password: env.REDIS.PASSWORD,
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redis;
