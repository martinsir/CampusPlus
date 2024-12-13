import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

console.log('Environment Variables:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS ? '(hidden)' : '(not provided)',
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
});


dotenv.config(); // Load environment variables from the .env file

const connectToDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT, 10) || 3306, // Ensure the port is a number
        });

        console.log('Connected to the database successfully!');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
};

export default connectToDatabase;
