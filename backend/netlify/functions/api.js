const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ticketRoutes = require('../../routes/tickets');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/tickets', ticketRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DeskFlow API is running' });
});

// cache the db connection between lambda invocations
let dbConn = null;

async function connectDB() {
  if (dbConn && mongoose.connection.readyState === 1) return dbConn;
  dbConn = await mongoose.connect(process.env.MONGO_URI);
  return dbConn;
}

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // strip function prefix so express sees /tickets not /.netlify/functions/api/tickets
  if (event.path) {
    event.path = event.path.replace(/^\/?\.netlify\/functions\/api/, '') || '/';
  }

  await connectDB();
  return handler(event, context);
};
