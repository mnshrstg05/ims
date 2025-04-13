const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
// const {changePassword} = require('../controllers/UserController');
const { loginUser } = require('../controllers/authController');
const authmiddleware = require('../middleware/authMiddleware')

// Routes for users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Route for login (newly added)
router.post('/login', loginUser);

// Other routes (getAllUsers, getUserById, etc.)
router.post('/change-password',authmiddleware, userController.changePassword);

module.exports = router;
