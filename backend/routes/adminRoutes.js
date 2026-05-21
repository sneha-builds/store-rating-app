// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validateSignup } = require('../middleware/validators');

const router = express.Router();

// Apply the security guards globally to all routes in this file
router.use(verifyToken);
router.use(checkRole(['admin']));

// 1. ADMIN DASHBOARD METRICS
router.get('/dashboard', async (req, res) => {
  try {
    // Run all count queries in parallel to make it lightning fast
    const [userRes, storeRes, ratingRes] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM stores'),
      db.query('SELECT COUNT(*) FROM ratings')
    ]);

    res.json({
      totalUsers: parseInt(userRes.rows[0].count),
      totalStores: parseInt(storeRes.rows[0].count),
      totalRatings: parseInt(ratingRes.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard metric totals.' });
  }
});

// 2. CREATE NEW USER (Admin can create 'admin' or 'owner')
router.post('/users', validateSignup, async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!['admin', 'owner', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role assignment designated.' });
  }

  try {
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      `INSERT INTO users (name, email, password_hash, address, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, address`,
      [name, email, passwordHash, address, role]
    );

    res.status(201).json({ message: 'User created successfully.', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create user.' });
  }
});

// 3. CREATE NEW STORE
router.post('/stores', async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  try {
    // Verify owner exists and is actually a store owner
    if (owner_id) {
      const ownerCheck = await db.query('SELECT role FROM users WHERE id = $1', [owner_id]);
      if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].role !== 'owner') {
        return res.status(400).json({ message: 'Assigned owner ID must belong to a user with the store owner role.' });
      }
    }

    const newStore = await db.query(
      `INSERT INTO stores (name, email, address, owner_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ message: 'Store added successfully.', store: newStore.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create store listing.' });
  }
});

// 4. VIEW & FILTER ALL USERS WITH SORTING
router.get('/users', async (req, res) => {
  // Extract query filters and sorting keys directly from URL params
  const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

  // Protect against SQL injection by checking allowed sorting columns
  const allowedSortFields = ['name', 'email', 'address', 'role'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let queryText = `
    SELECT id, name, email, address, role,
    CASE WHEN role = 'owner' THEN (SELECT COALESCE(AVG(rating_value), 0) FROM ratings WHERE store_id IN (SELECT id FROM stores WHERE owner_id = users.id)) ELSE NULL END as store_rating
    FROM users WHERE 1=1
  `;
  const queryParams = [];

  // Dynamically compile SQL strings based on search filters provided
  if (name) { queryParams.push(`%${name}%`); queryText += ` AND name ILIKE $${queryParams.length}`; }
  if (email) { queryParams.push(`%${email}%`); queryText += ` AND email ILIKE $${queryParams.length}`; }
  if (address) { queryParams.push(`%${address}%`); queryText += ` AND address ILIKE $${queryParams.length}`; }
  if (role) { queryParams.push(role); queryText += ` AND role = $${queryParams.length}`; }

  queryText += ` ORDER BY ${safeSortBy} ${safeOrder}`;

  try {
    const result = await db.query(queryText, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving system users inventory.' });
  }
});

// 5. VIEW & FILTER ALL STORES WITH AVERAGE RATINGS & SORTING
router.get('/stores', async (req, res) => {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;

  const allowedSortFields = ['name', 'address', 'overall_rating'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
  const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  // Perform a clean mathematical aggregation using LEFT JOIN
  let queryText = `
    SELECT s.id, s.name, s.email, s.address, s.owner_id,
           COALESCE(ROUND(AVG(r.rating_value), 2), 0) as overall_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const queryParams = [];

  if (name) { queryParams.push(`%${name}%`); queryText += ` AND s.name ILIKE $${queryParams.length}`; }
  if (address) { queryParams.push(`%${address}%`); queryText += ` AND s.address ILIKE $${queryParams.length}`; }

  queryText += ` GROUP BY s.id`;
  
  // Wrap in a subquery or handle order formatting cleanly
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
    res.status(500).json({ message: 'Error retrieving stores directory.' });
  }
});

module.exports = router;