import express from 'express';
import connectToDatabase from '../db.js';

const router = express.Router();

/**
 * Fetch all users
 */
router.get('/users', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [users] = await db.query('SELECT * FROM Users;');
        db.end();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

/**
 * Add a new user
 */
router.post('/users', async (req, res) => {
    const { name, email, role, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and role are required' });
    }

    try {
        const db = await connectToDatabase();
        const [result] = await db.query(
            'INSERT INTO Users (Name, Email, Role, PhoneNumber) VALUES (?, ?, ?, ?);',
            [name, email, role, phoneNumber || null]
        );
        db.end();
        res.json({ message: 'User added successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

/**
 * Update an existing user
 */
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, phoneNumber } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and role are required' });
    }

    try {
        const db = await connectToDatabase();
        const [result] = await db.query(
            'UPDATE Users SET Name = ?, Email = ?, Role = ?, PhoneNumber = ? WHERE UserID = ?;',
            [name, email, role, phoneNumber || null, id]
        );
        db.end();
        res.json({ message: 'User updated successfully', affectedRows: result.affectedRows });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

/**
 * Delete a user
 */
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = await connectToDatabase();
        const [result] = await db.query('DELETE FROM Users WHERE UserID = ?;', [id]);
        db.end();
        res.json({ message: 'User deleted successfully', affectedRows: result.affectedRows });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

export default router;
