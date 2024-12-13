import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' }); // Ensure .env is loaded

const connectToDatabase = async () => {
    try {
        console.log('Connecting with the following credentials:');
        console.log({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS ? '(hidden)' : '(not provided)',
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT, 10) || 3306,
        });

        console.log('Connected to the database successfully!');
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
};

export default connectToDatabase;
