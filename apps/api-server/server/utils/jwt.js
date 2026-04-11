const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'juyouhui-secret-key-2026';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken, JWT_SECRET };
