exports.errorResponse = (error) => {
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'An error occurred processing the request',
      error: error.message,
    }),
  };
};

exports.successResponse = (result) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  };
};
