import express from 'express';
import connectToDatabase from '../db.js'; // Import the database connection function

const router = express.Router();

router.get('/test-db', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [result] = await db.query('SELECT DATABASE() AS dbName;');
        console.log('Connected to database:', result[0].dbName);
        res.json({
            message: 'Database connection successful!',
            database: result[0].dbName,
        });
        db.end(); // Close the connection after testing
    } catch (error) {
        console.error('Database test failed:', error.message);
        res.status(500).json({
            error: 'Database connection failed',
            details: error.message,
        });
    }
});

export default router;
