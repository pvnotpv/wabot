const Redis = require("ioredis");

//FOR RAILWAY AND HEROKU

const rClient = new Redis({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
    user: process.env.REDISUSER,
    password: process.env.REDISPASSWORD,
    url: process.env.REDISURL
});

module.exports = rClient