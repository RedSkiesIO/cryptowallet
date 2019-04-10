const DotEnv = require('dotenv');
const parsedEnv = DotEnv.config().parsed;

function toExport() {
  const keys = Object.keys(parsedEnv);
  keys.forEach((key) => {
    if (typeof parsedEnv[key] === 'string') {
      parsedEnv[key] = JSON.stringify(parsedEnv[key]);
    }
  });

  return parsedEnv;
}

module.exports = toExport;
