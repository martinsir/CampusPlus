import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../db.js';

const router = express.Router();

// Utility to handle errors
const handleError = (res, error, statusCode = 500, message = 'An error occurred') => {
    console.error(`${message}:`, error.message || error);
    res.status(statusCode).json({ error: message });
};

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const db = await connectToDatabase();

        // Check if user exists
        const [users] = await db.query('SELECT * FROM Users WHERE Email = ?;', [email]);
        const user = users[0];

        if (!user) {
            db.end();
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            db.end();
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.UserID, role: user.Role },
            process.env.JWT_SECRET, // Ensure this is set in your .env file
            { expiresIn: '1h' }
        );

        db.end();

        // Return success response with token
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.UserID, name: user.Name, role: user.Role },
        });
    } catch (error) {
        handleError(res, error, 500, 'Failed to log in');
    }
});

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register Route
router.post('/register', async (req, res) => {
    const { name, email, password, role, phoneNumber, schoolId } = req.body;

    console.log('Registration attempt:', req.body);

    // Check for required fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    // Password validation (dummy secure requirements)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.',
        });
    }

    try {
        const db = await connectToDatabase();

        // Check if the email already exists
        const [existingUser] = await db.query('SELECT * FROM Users WHERE Email = ?;', [email]);
        if (existingUser.length > 0) {
            db.end();
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const [result] = await db.query(
            'INSERT INTO Users (Name, Email, Password, Role, PhoneNumber, SchoolID) VALUES (?, ?, ?, ?, ?, ?);',
            [name, email, hashedPassword, role, phoneNumber || null, schoolId || null]
        );

        console.log('User successfully registered:', result.insertId);

        // Generate JWT token for automatic login
        const token = jwt.sign(
            { id: result.insertId, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        db.end();

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
            token,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});


// Export the router
export default router;
