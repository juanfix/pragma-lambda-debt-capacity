exports.logInfo = (message, data = {}) => {
  console.log(
    JSON.stringify({
      level: 'INFO',
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  );
};

exports.logError = (message, error) => {
  console.error(
    JSON.stringify({
      level: 'ERROR',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  );
};
