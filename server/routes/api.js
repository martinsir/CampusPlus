import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../db.js';

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { name, email, password, role, phoneNumber, schoolId } = req.body;

    console.log('Incoming registration data:', req.body);

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character.',
        });
    }

    try {
        const db = await connectToDatabase();
        console.log('[DEBUG] Connected to the database.');

        const [existingUser] = await db.query('SELECT * FROM Users WHERE Email = ?;', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO Users (Name, Email, Password, Role, PhoneNumber, SchoolID) VALUES (?, ?, ?, ?, ?, ?);',
            [name, email, hashedPassword, role, phoneNumber || null, schoolId || null]
        );

        console.log('[DEBUG] User successfully registered:', result.insertId);

        const token = jwt.sign(
            { id: result.insertId, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
            token,
        });
    } catch (error) {
        console.error('[ERROR] Registration failed:', error.message || error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

export default router;
