const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT || 3000);
const jwtSecret = process.env.JWT_SECRET;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('Missing DATABASE_URL. Add it to your .env file.');
}

if (!jwtSecret) {
    throw new Error('Missing JWT_SECRET. Add it to your .env file.');
}

const pool = new Pool({ connectionString: databaseUrl });

const runMigrations = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS customers (
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(120) NOT NULL,
            email VARCHAR(160) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            phone VARCHAR(25),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);
};

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/auth/signup', async (req, res) => {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Full name, email, and password are required.' });
    }

    if (String(password).length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
        const existing = await pool.query('SELECT id FROM customers WHERE email = $1', [email.toLowerCase()]);
        if (existing.rowCount > 0) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const inserted = await pool.query(
            'INSERT INTO customers (full_name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email',
            [fullName.trim(), email.toLowerCase(), passwordHash, phone?.trim() || null]
        );

        return res.status(201).json({
            message: 'Account created successfully. You can now log in.',
            customer: inserted.rows[0]
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Unable to create account at this time.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const result = await pool.query(
            'SELECT id, full_name, email, password_hash FROM customers WHERE email = $1',
            [email.toLowerCase()]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const customer = result.rows[0];
        const validPassword = await bcrypt.compare(password, customer.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { sub: customer.id, email: customer.email, fullName: customer.full_name },
            jwtSecret,
            { expiresIn: '2h' }
        );

        return res.json({
            message: 'Login successful.',
            token,
            customer: {
                id: customer.id,
                fullName: customer.full_name,
                email: customer.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Unable to login at this time.' });
    }
});

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

runMigrations()
    .then(() => {
        app.listen(port, () => {
            console.log(`DBR Solar EPC app running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize database schema:', error);
        process.exit(1);
    });
