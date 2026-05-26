const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ticketRoutes = require('../../routes/tickets');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/tickets', ticketRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DeskFlow API is running', timestamp: new Date() });
});

// cache the db connection between lambda invocations
let dbConn = null;

async function connectDB() {
  if (dbConn && mongoose.connection.readyState === 1) return dbConn;
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }
  dbConn = await mongoose.connect(process.env.MONGO_URI);
  return dbConn;
}

const appHandler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // strip the netlify function prefix so express sees /tickets not /.netlify/functions/api/tickets
  if (event.path) {
    event.path = event.path
      .replace(/^\/\.netlify\/functions\/api/, '')
      .replace(/^\/api/, '') || '/';
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error:', err.message);
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Database connection failed. Check MONGO_URI env var.' })
    };
  }

  return appHandler(event, context);
};
