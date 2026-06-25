require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to understand incoming JSON requests
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/schedule', require('./routes/scheduleRoutes'));

// A basic test route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Degree Planner API is running successfully.' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});