const commonErorHandler = (err, req, res, next) => {
  const { status, message } = err;
  res.status(status || 400).json({ message });
};

module.exports = commonErorHandler;
