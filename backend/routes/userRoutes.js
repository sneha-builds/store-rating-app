// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply security guards globally to all routes in this file
router.use(verifyToken);
router.use(checkRole(['user'])); // Only normal users can access these features

// 1. UPDATE PASSWORD
router.put('/update-password', async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.id; // Extracted from decoded JWT token payload

  // Validate password length constraints explicitly requested by the firm
  if (!newPassword || newPassword.length < 8 || newPassword.length > 16) {
    return res.status(400).json({ message: 'Password must be between 8 and 16 characters.' });
  }
  if (!/[A-Z]/.test(newPassword) || !/[^a-zA-Z0-9]/.test(newPassword)) {
    return res.status(400).json({ message: 'Password must include at least one uppercase letter and one special character.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update password.' });
  }
});

// 2. VIEW STORES WITH OVERALL RATINGS & CURRENT USER'S INDIVIDUAL RATINGS
router.get('/stores', async (req, res) => {
  const userId = req.user.id;
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;

  // Protect sorting injection fields
  const allowedSortFields = ['name', 'address', 'overall_rating'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  /* 
    Professional Query Checklist:
    - We left join the ratings table ONCE to compute the global store average score.
    - We left join the ratings table a SECOND time filtered by the current active user ID 
      to see exactly what score they historically submitted.
  */
  let queryText = `
    SELECT 
      s.id, 
      s.name, 
      s.address,
      COALESCE(ROUND(AVG(r_all.rating_value), 2), 0) as overall_rating,
      COALESCE(r_user.rating_value, 0) as user_submitted_rating
    FROM stores s
    LEFT JOIN ratings r_all ON s.id = r_all.store_id
    LEFT JOIN ratings r_user ON s.id = r_user.store_id AND r_user.user_id = $1
    WHERE 1=1
  `;
  const queryParams = [userId];

  if (name) {
    queryParams.push(`%${name}%`);
    queryText += ` AND s.name ILIKE $${queryParams.length}`;
  }
  if (address) {
    queryParams.push(`%${address}%`);
    queryText += ` AND s.address ILIKE $${queryParams.length}`;
  }

  queryText += ` GROUP BY s.id, r_user.rating_value`;

  if (safeSortBy === 'overall_rating') {
    queryText += ` ORDER BY overall_rating ${safeOrder}`;
  } else {
    queryText += ` ORDER BY s.${safeSortBy} ${safeOrder}`;
  }

  try {
    const result = await db.query(queryText, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving stores list directory.' });
  }
});

// 3. SUBMIT OR MODIFY A RATING (The Professional SQL Upsert Trick)
router.post('/stores/:id/rate', async (req, res) => {
  const storeId = req.params.id;
  const userId = req.user.id;
  const { ratingValue } = req.body;

  const score = parseInt(ratingValue);
  if (isNaN(score) || score < 1 || score > 5) {
    return res.status(400).json({ message: 'Rating value must be an integer ranging between 1 and 5.' });
  }

  try {
    // Check if store exists first
    const storeCheck = await db.query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Target store matching this ID not found.' });
    }

    /*
      Instead of writing separate POST and PUT routing handlers, a professional uses 
      "ON CONFLICT DO UPDATE". If a rating rule breaks our unique composite key constraint 
      (meaning they rated it before), PostgreSQL automatically morphs the query into an UPDATE!
    */
    const queryText = `
      INSERT INTO ratings (user_id, store_id, rating_value, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, store_id) 
      DO UPDATE SET rating_value = EXCLUDED.rating_value, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await db.query(queryText, [userId, storeId, score]);
    res.json({
      message: 'Rating processed successfully!',
      rating: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process store rating adjustment request.' });
  }
});

module.exports = router;