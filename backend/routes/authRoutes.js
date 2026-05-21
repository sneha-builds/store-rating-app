// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); 
const { validateSignup, validateLogin } = require('../middleware/validators');

const router = express.Router();

// 1. PUBLIC SIGNUP (Enforced as normal 'user' role only)
router.post('/signup', validateSignup, async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Securely hash plain text password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      `INSERT INTO users (name, email, password_hash, address, role) 
       VALUES ($1, $2, $3, $4, 'user') RETURNING id, name, email, role`,
      [name, email, passwordHash, address]
    );

    res.status(201).json({
      message: 'Registration successful!',
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// 2. UNIFIED LOGIN SYSTEM (Decides routing experience on frontend via token payload)
router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Embed ID and Role securely inside token payload
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: `Welcome back, ${user.name}!`,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
});

module.exports = router;