const express = require('express');
const cookieParser = require('cookie-parser');

// Routes 
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);



module.exports = app;