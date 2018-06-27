const fs = require('fs');

let config;
let env = process.env.NODE_ENV;
console.log(env)
if (env === undefined) {
    env = 'development';
}
env = env.trim();
console.log(`config.${env.toLowerCase()}.json`)
if (fs.existsSync(`./config/config.${env.toLowerCase()}.json`)) {
    config = require(`./config.${env.toLowerCase()}.json`);
} else {
    throw "config file not found";
}
module.exports = config;