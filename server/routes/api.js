import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../db.js';

const router = express.Router();

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded data to request
        next();
    } catch (error) {
        console.error('[ERROR] Token verification failed:', error.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

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

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('[DEBUG] Incoming login data:', req.body);

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const db = await connectToDatabase();
        console.log('[DEBUG] Connected to the database.');

        const [userResult] = await db.query('SELECT * FROM Users WHERE Name = ?;', [username]);
        if (userResult.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = userResult[0];

        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.ID, role: user.Role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            userId: user.ID,
            role: user.Role,
            token,
        });
    } catch (error) {
        console.error('[ERROR] Login failed:', error.message || error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Protected Route: Get User Profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        console.log('[DEBUG] Fetching profile for user ID:', req.user.id);

        const [userResult] = await db.query('SELECT * FROM Users WHERE UserID = ?;', [req.user.id]);

        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult[0];
        res.status(200).json({
            id: user.UserID,
            name: user.Name,
            email: user.Email,
            role: user.Role,
            phoneNumber: user.PhoneNumber,
        });
    } catch (error) {
        console.error('[ERROR] Fetching user profile failed:', error.message || error);
        res.status(500).json({ error: 'Server error fetching user profile' });
    }
});



export default router;
