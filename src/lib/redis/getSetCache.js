const Redis = require('redis');

module.exports = async function getSetCache(key, aliveTime, callbackFunc) {
  try {
    const redisClient = Redis.createClient({});
    await redisClient.connect();
    const data = await redisClient.get(key);
    if (data) {
      await redisClient.quit();
      return JSON.parse(data);
    }
    const newData = await callbackFunc();
    await redisClient.SETEX(key, aliveTime, JSON.stringify(newData));
    await redisClient.quit();
    return newData;
  } catch (error) {
    return null;
  }
};
