const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
    );

    console.log(`Token generated for ${user.email}`);
    return token;
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(`Register attempt - Email: ${email}, Role: ${role}`);

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        const token = generateToken(user);
        const { password: _, ...userData } = user._doc;

        res.status(201).json({ token, user: userData });
    } catch (error) {
        console.error(`Registration error:`, error.message);
        res.status(500).json({ message: 'Registration error' });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        console.log(`Login successful: ${email}`);

        const token = generateToken(user);
        const { password: _, ...userData } = user._doc;

        res.status(200).json({ token, user: userData });
    } catch (error) {
        console.error(`Login error:`, error.message);
        res.status(500).json({ message: 'Login error' });
    }
};

