const http = require('node:http');
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5001;

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
