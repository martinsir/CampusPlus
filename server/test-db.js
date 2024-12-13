import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' }); // Ensure .env is loaded

const testQuery = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT, 10) || 3306,
        });

        console.log('Connection successful!');

        // Fetch data from Users table
        const [users] = await connection.query('SELECT * FROM Users;');
        console.log('Users:', users);

        connection.end();
    } catch (error) {
        console.error('Query failed:', error.message);
    }
};

const testInsert = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT, 10) || 3306,
        });

        console.log('Connection successful!');

        // Insert a new user
        const [result] = await connection.query(
            'INSERT INTO Users (name, email) VALUES (?, ?);',
            ['New User', 'newuser@example.com']
        );
        console.log('Inserted row ID:', result.insertId);

        connection.end();
    } catch (error) {
        console.error('Insert query failed:', error.message);
    }
};

testInsert();



testQuery();
