const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { name, phone, role, password, riceMillName, city, location } = req.body;

    try {
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            name,
            phone,
            role,
            password,
            riceMillName,
            city,
            location
        });

        await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: {
              id: user._id,
              name: user.name,
              phone: user.phone,
              role: user.role,
              riceMillName: user.riceMillName,
              city: user.city,
              location: user.location
            }
          });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };
