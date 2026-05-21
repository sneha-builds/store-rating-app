// routes/ownerRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
router.use(checkRole(['owner']));

// 1. OWNER UPDATE PASSWORD
router.put('/update-password', async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.id;

  if (!newPassword || newPassword.length < 8 || newPassword.length > 16 || !/[A-Z]/.test(newPassword) || !/[^a-zA-Z0-9]/.test(newPassword)) {
    return res.status(400).json({ message: 'Password failed pattern matching criteria requirements.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to modify owner password.' });
  }
});

// 2. OWNER ANALYTICS DASHBOARD
router.get('/dashboard', async (req, res) => {
  const ownerId = req.user.id;

  try {
    // Step A: Find the store that belongs to this specific owner
    const storeResult = await db.query('SELECT id, name FROM stores WHERE owner_id = $1', [ownerId]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'No registered store profile linked to this owner account configuration.' });
    }

    const storeId = storeResult.rows[0].id;
    const storeName = storeResult.rows[0].name;

    // Step B: Calculate average metric and aggregate reviewer profile logs in parallel
    const [statsRes, reviewersRes] = await Promise.all([
      db.query('SELECT COALESCE(ROUND(AVG(rating_value), 2), 0) as avg_rating FROM ratings WHERE store_id = $1', [storeId]),
      db.query(`
        SELECT u.name, u.email, u.address, r.rating_value, r.updated_at
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        WHERE r.store_id = $1
        ORDER BY r.updated_at DESC
      `, [storeId])
    ]);

    res.json({
      storeName,
      averageRating: parseFloat(statsRes.rows[0].avg_rating),
      reviewers: reviewersRes.rows[0] ? reviewersRes.rows : []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving owner dashboard analysis.' });
  }
});

module.exports = router;