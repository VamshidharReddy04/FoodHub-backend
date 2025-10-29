const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;
const { mongoDB, getFoodItems } = require('./db');

// CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
(async () => {
  try {
    await mongoDB();
    console.log('food_items:', JSON.stringify(global.food_items || [], null, 2));
    console.log('food_category:', JSON.stringify(global.food_category || [], null, 2));

    app.use('/api', require('./Routes/CreateUser'));
    app.use('/api', require('./Routes/DisplayData'));

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ success: true, status: 'healthy', message: 'Server is running' });
    });

    app.get('/', async (req, res) => {
      try {
        const data = await getFoodItems();
        res.json({ success: true, data });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB, server not started:', err);
  }
})();
module.exports = app;