# Order Tracking System

A production-ready order tracking dashboard with a modern UI, built using React, Node.js, and MySQL.

## 🚀 Features
- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion for smooth animations and a premium feel.
- **Order Lifecycle**: Strict transition flow (Placed → Packed → Shipped → Delivered).
- **Progress Tracking**: Visual stepper for each order showing current status.
- **Real-time Validations**: Prevents skipping or reversing stages.

---

## 🛠️ Setup Instructions

### 1. Database Setup (MySQL)
1. Log in to your MySQL terminal/client.
2. Run the following command or use the `server/schema.sql` file:
```sql
CREATE DATABASE order_tracker;
USE order_tracker;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    status ENUM('placed', 'packed', 'shipped', 'delivered') DEFAULT 'placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Setup
1. Navigate to the `server` folder:
2. Update `.env` with your database credentials:
   - `DB_USER` (usually `root`)
   - `DB_PASSWORD` (your MySQL password)
3. Install dependencies and start:
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
1. Navigate to the `client` folder.
2. Install dependencies and start:
```bash
cd client
npm install
npm run dev
```

---

## 🎨 Design Elements
- **Glassmorphism**: Sticky navbar with backdrop blur.
- **Responsive Grid**: Dashboard automatically adjusts for mobile and desktop.
- **Status Badges**: Color-coded badges for quick identification.
- **Micro-interactions**: Hover effects on cards and subtle button animations.

---

## ⚙️ Tech Stack
- **Frontend**: Vite, React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (mysql2).
- **Notifications**: React Hot Toast.
