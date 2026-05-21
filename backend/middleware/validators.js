// middleware/validators.js
const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Returns clean, readable array fields of exactly what failed
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateSignup = [
  body('name')
    .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters long.'),
  body('email')
    .isEmail().withMessage('Please provide a valid standard email address.')
    .normalizeEmail(),
  body('address')
    .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters.'),
  body('password')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters.')
    .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter.')
    .matches(/[^a-zA-Z0-9]/).withMessage('Password must include at least one special character.'),
  validateRequest
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email format.'),
  body('password').notEmpty().withMessage('Password field cannot be empty.'),
  validateRequest
];

module.exports = {
  validateSignup,
  validateLogin
};