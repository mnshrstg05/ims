const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

const loginUser = async (req, res) => {
    const { username, password } = req.body;  // Make sure username and password are provided


    try {
        const user = await User.findOne({ username });


        if (!user) {
            return res.status(400).json({ message: 'User not found' });  // Error if no user found
        }

        // Compare the entered password with the stored (hashed) password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If credentials are correct, generate a JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, 'pfixs', { expiresIn: '1h' });
        res.json({ token, userId: user._id,
            username: user.username,
            role: user.role, });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { loginUser };
