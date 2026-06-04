const http = require('node:http');
require('dotenv').config();
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 5001;

const httpServer = http.createServer(app);

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database connected and synced');

    httpServer.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
