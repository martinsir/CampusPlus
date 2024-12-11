import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON
app.use(express.json());

// Use API routes
app.use('/api', apiRoutes);

// Check if the dist folder exists
const distFolder = path.join(__dirname, '../dist');
if (fs.existsSync(distFolder)) {
    // Serve static files from the dist folder
    app.use(express.static(distFolder));

    // Fallback to index.html for Single Page Applications
    app.get('*', (req, res) => {
        res.sendFile(path.join(distFolder, 'index.html'));
    });
} else {
    console.log('Dist folder not found. Skipping static file serving.');
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
