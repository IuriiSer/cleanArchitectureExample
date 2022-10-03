const Redis = require('redis');

module.exports = async function setCache(key, aliveTime, callbackFunc) {
  try {
    console.log(`setCache -> ${key}`);
    const redisClient = Redis.createClient({});
    await redisClient.connect();
    const newData = await callbackFunc();
    await redisClient.SETEX(key, aliveTime / 1000, JSON.stringify(newData));
    await redisClient.quit();
    return newData;
  } catch (error) {
    return null;
  }
};
