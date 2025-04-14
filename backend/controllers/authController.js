const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, 'pfixs', { expiresIn: '1h' });

    res.json({
      token,
      userId: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { loginUser };
