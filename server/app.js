const express = require('express');
const path = require('path');
const cors = require('cors');
const router = require('./routers');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const uploadPath = path.resolve(__dirname, '..', 'public', 'uploads'); // той самий, що в upload.js
app.use('/uploads', express.static(uploadPath));

app.use(express.json());

app.use('/api', router);

module.exports = app;
