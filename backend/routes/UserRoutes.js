const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public
router.post('/login', loginUser);

// Protected
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.post('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
