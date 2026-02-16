const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['https://corenova-ai-mentor-pro-arag.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

// Ensure database connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({ message: 'Database connection failed', error: error.message });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working correctly' });
});

app.get('/', (req, res) => {
  res.send('CoreNova AI Mentor Pro API is running');
});

// Import Routes
const webhookRoutes = require('./routes/webhookRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/webhook', webhookRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
