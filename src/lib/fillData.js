async function fillData({ data, key }, { callback, dataKeys }) {
  try {
    const newDataId = data[key];
    if (!newDataId) return null;
    const newData = await callback(newDataId);
    const injection = {};
    if (!dataKeys) {
      data[key] = newData;
      return injection;
    }
    dataKeys.forEach((dataKey) => {
      injection[dataKey] = newData[dataKey];
    });
    data[key] = injection;
    return injection;
  } catch (err) {
    throw Error(`err while fillData -> ${err.message}`);
  }
}

module.exports = fillData;
