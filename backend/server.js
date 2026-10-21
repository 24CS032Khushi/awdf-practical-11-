const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'task-backend' });
});

app.get('/api/tasks', async (_req, res) => {
  try {
    const tasks = await mongoose.connection.db.collection('tasks')
      .find({}).sort({ createdAt: -1 }).toArray();
    res.json(tasks);
  } catch (error) {
    res.status(503).json({ message: 'Database is not ready' });
  }
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => console.log(`Backend listening on ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
start();
