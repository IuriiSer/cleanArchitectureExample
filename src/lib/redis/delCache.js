require('dotenv').config();
const Redis = require('redis');

module.exports = async function delCache(key) {
  try {
    const redisClient = Redis.createClient();
    await redisClient.connect();
    const data = await redisClient.del(key);
    await redisClient.quit();
    return data;
  } catch (error) {
    return null;
  }
};
