const { Redis } = require("ioredis");
require("dotenv").config();

const client = new Redis({
  host: process.env.REDISHOST,
  port: process.env.REDISPORT,
  password: process.env.REDISPASSWORD,
});

module.exports = client;