const express = require('express');
const path = require('path');
const cors = require('cors');
const router = require('./routers');

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes('localhost') ||
        origin.includes('vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

const uploadPath = path.resolve(__dirname, '..', 'public', 'uploads');
app.use('/uploads', express.static(uploadPath));

app.use(express.json());

app.use('/api', router);

module.exports = app;
