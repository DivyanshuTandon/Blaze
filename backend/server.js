const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const contactRoute = require('./api/routes/contact');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const dbConnectionString = process.env.DB_CONNECTION_STRING;

mongoose.connect(dbConnectionString);

mongoose.connection.on('error', (error) => {
  console.log('Connection failed:', error);
});

mongoose.connection.on('connected', () => {
  console.log('Connected with database..');
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/contact', contactRoute);

const appDir = path.resolve();
app.use(express.static(path.join(appDir, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(appDir, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const http = require('http');

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

server.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
