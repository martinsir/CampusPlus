import express from 'express';
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Server is up and running!' });
});

// Data route
router.get('/data', (req, res) => {
    res.json({ message: 'Here’s more data from the backend!' });
});

export default router; // Export the router
