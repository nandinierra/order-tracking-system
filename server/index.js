const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const STATUS_FLOW = ['placed', 'packed', 'shipped', 'delivered'];

// Use SQLite for "Plug & Play" - Works without any setup!
// If you want to use MySQL, you can easily swap this out.
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Database opening error:', err.message);
    } else {
        console.log('Connected to SQLite Database (database.sqlite)');
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            item TEXT NOT NULL,
            status TEXT DEFAULT 'placed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Table creation error:', err.message);
            else console.log('Orders table verified/created');
        });
    }
});

// Helper for SQLite promises
const dbQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

// Routes
app.post('/orders', async (req, res) => {
    const { customer_name, item } = req.body;
    if (!customer_name || !item) {
        return res.status(400).json({ error: 'Customer name and item are required' });
    }

    try {
        const result = await dbRun(
            'INSERT INTO orders (customer_name, item, status) VALUES (?, ?, ?)',
            [customer_name, item, 'placed']
        );
        const orders = await dbQuery('SELECT * FROM orders WHERE id = ?', [result.lastID]);
        res.status(201).json(orders[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const rows = await dbQuery('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await dbQuery('SELECT status FROM orders WHERE id = ?', [id]);
        if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });

        const currentStatus = orders[0].status;
        const currentIndex = STATUS_FLOW.indexOf(currentStatus);

        if (currentIndex === STATUS_FLOW.length - 1) {
            return res.status(400).json({ error: 'Order already delivered' });
        }

        const nextStatus = STATUS_FLOW[currentIndex + 1];
        await dbRun('UPDATE orders SET status = ? WHERE id = ?', [nextStatus, id]);
        
        const updated = await dbQuery('SELECT * FROM orders WHERE id = ?', [id]);
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
