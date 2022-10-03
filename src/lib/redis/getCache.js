require('dotenv').config();
const Redis = require('redis');

module.exports = async function getCache(key) {
  try {
    console.log(`getCache -> ${key}`);
    const redisClient = Redis.createClient();
    await redisClient.connect();
    const data = await redisClient.get(key);
    await redisClient.quit();
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    return null;
  }
};
