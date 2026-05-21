// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes'); 
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Bindings
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/owner', ownerRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: "Store Rating System API core completely running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Complete Back-End API Server listening on port ${PORT}`);
});