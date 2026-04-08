const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const STATUS_FLOW = ['placed', 'packed', 'shipped', 'delivered'];

// Initialize better-sqlite3
const db = new Database('./database.sqlite', { verbose: console.log });
console.log('Connected to SQLite Database via better-sqlite3');

// Create table if not exists
db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        item TEXT NOT NULL,
        status TEXT DEFAULT 'placed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);
console.log('Orders table verified/created');

// Routes
app.post('/orders', (req, res) => {
    const { customer_name, item } = req.body;
    if (!customer_name || !item) {
        return res.status(400).json({ error: 'Customer name and item are required' });
    }

    try {
        const insert = db.prepare('INSERT INTO orders (customer_name, item, status) VALUES (?, ?, ?)');
        const result = insert.run(customer_name, item, 'placed');
        
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/orders', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/orders/:id', (req, res) => {
    const { id } = req.params;
    try {
        const order = db.prepare('SELECT status FROM orders WHERE id = ?').get(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const currentStatus = order.status;
        const currentIndex = STATUS_FLOW.indexOf(currentStatus);

        if (currentIndex === STATUS_FLOW.length - 1) {
            return res.status(400).json({ error: 'Order already delivered' });
        }

        const nextStatus = STATUS_FLOW[currentIndex + 1];
        db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(nextStatus, id);
        
        const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
