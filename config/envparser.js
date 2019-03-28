const DotEnv = require('dotenv');

const parsedEnv = DotEnv.config().parsed;

console.log('1', parsedEnv);

function toExport() {
  const keys = Object.keys(parsedEnv);
  keys.forEach((key) => {
    if (typeof parsedEnv[key] === 'string') {
      parsedEnv[key] = JSON.stringify(parsedEnv[key]);
    }
  });

  console.log('2', parsedEnv);

  return parsedEnv;
}

module.exports = toExport;
