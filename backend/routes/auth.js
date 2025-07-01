const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Ruta protegida
router.get('/me', verifyToken, getMe);

module.exports = router;
