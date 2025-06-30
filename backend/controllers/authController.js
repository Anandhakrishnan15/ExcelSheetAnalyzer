const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {//generateToken with the user  promt given in from the register and login 
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_KEY,
        { expiresIn: '24h' } //expire in 24 h
    );

    return token;
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;// get the info from the body

    try {
        const existing = await User.findOne({ email });// check the existing the email or not is not send err res
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10); // if the user is new then hash the pWD

        const user = await User.create({//creat the colletion in the user 
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        const token = generateToken(user); // generate the token
        res.status(201).json({ token }); //send the token to the frontend
    } catch (error) {
        console.error(`Registration error:`, error.message);
        res.status(500).json({ message: 'Registration error' });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body; // get the email and the password from  the  body
    // if(!email )

    try {
        const user = await User.findOne({ email }); // look for the email in teh user collection in DB
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });// if not  there return invalid email or password

        const isMatch = await bcrypt.compare(password, user.password); // cheking the given pwd is same as the bcrpt pwd from teh user colletion
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });//if not  there return invalid email or password

        console.log(`Login successful: ${email}`);

        const token = generateToken(user); //generat the token

        res.status(200).json({ token }); //give token to store in the localstoreage
    } catch (error) {
        console.error(`Login error:`, error.message);
        res.status(500).json({ message: 'Login error' });
    }
};

