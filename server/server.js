import express from 'express';
import connectToDatabase from './db.js';

const app = express();
const PORT = 3000;

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [result] = await db.query('SELECT DATABASE() AS dbName;');
        console.log('Connected to database:', result[0].dbName);
        res.json({ message: 'Database connection successful!', database: result[0].dbName });
        db.end(); // Close the connection
    } catch (error) {
        console.error('Database test failed:', error.message);
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
