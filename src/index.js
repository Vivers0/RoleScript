require('dotenv').config();
const { Client } = require('./Client');

const client = new Client(process.env.TOKEN, process.env.PREFIX);
client.start();
