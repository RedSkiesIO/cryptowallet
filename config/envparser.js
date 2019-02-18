const DotEnv = require('dotenv');

const parsedEnv = DotEnv.config().parsed;

module.exports = function () {
  const keys = Object.keys(parsedEnv);
  keys.forEach((key) => {
    if (typeof parsedEnv[key] === 'string') {
      parsedEnv[key] = JSON.stringify(parsedEnv[key]);
    }
  });
  return parsedEnv;
};
