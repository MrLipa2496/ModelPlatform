const http = require('node:http');
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '127.0.0.1';

const httpServer = http.createServer(app);

httpServer.listen(PORT, HOST, () =>
  console.log(`Server is listening http://${HOST}:${PORT}`)
);
