# 💸 Expensio — Full-Stack Expense Tracker

A full-stack expense tracker built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🗂️ Project Structure

```
expensio/
├── backend/                  # Node.js + Express + MongoDB API
│   ├── models/
│   │   └── Expense.js        # Mongoose schema
│   ├── routes/
│   │   └── expenses.js       # REST API routes
│   ├── .env                  # Environment variables
│   ├── .env.example          # Template for env vars
│   ├── server.js             # Express entry point
│   └── package.json
│
└── frontend/                 # React + Vite + Bootstrap
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── SummaryStats.jsx
    │   │   ├── ExpenseModal.jsx
    │   │   ├── ExpenseTable.jsx
    │   │   ├── CategoryChart.jsx
    │   │   └── FilterBar.jsx
    │   ├── services/
    │   │   └── api.js         # Axios API calls
    │   ├── utils/
    │   │   └── categories.js  # Constants & helpers
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port 27017)
  - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cloud cluster

---

## 🚀 Setup & Run

### 1. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu / Debian
sudo systemctl start mongod

# Windows — start MongoDB service via Services panel
# Or use mongosh / MongoDB Compass
```

### 2. Backend

```bash
cd backend
npm install
# Edit .env if needed (defaults work for local MongoDB)
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser. The Vite dev server proxies all `/api` calls to the backend automatically.

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/expenses`           | List expenses (with filters) |
| GET    | `/api/expenses/summary`   | Summary stats + by-category  |
| GET    | `/api/expenses/:id`       | Single expense               |
| POST   | `/api/expenses`           | Create expense               |
| PUT    | `/api/expenses/:id`       | Update expense               |
| DELETE | `/api/expenses/:id`       | Delete expense               |
| DELETE | `/api/expenses`           | Clear all expenses           |
| GET    | `/api/health`             | Health check                 |

### Query params for GET /api/expenses
| Param      | Example          | Description            |
|------------|------------------|------------------------|
| category   | `food`           | Filter by category     |
| startDate  | `2024-01-01`     | From date              |
| endDate    | `2024-12-31`     | To date                |
| sort       | `-date` / `amount` | Sort field            |
| page       | `1`              | Pagination page        |
| limit      | `50`             | Items per page         |

### Expense Body (POST / PUT)
```json
{
  "name": "Grocery run",
  "amount": 850.50,
  "category": "food",
  "note": "Monthly vegetables",
  "date": "2024-06-15"
}
```

### Categories
`food` | `transport` | `housing` | `health` | `entertainment` | `shopping` | `other`

---

## 🌍 Environment Variables (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expensio
NODE_ENV=development
```

For **MongoDB Atlas**, replace MONGO_URI:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expensio?retryWrites=true&w=majority
```

---

## 🏗️ Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React 18, Vite, Bootstrap 5, Bootstrap Icons, Axios, react-hot-toast |
| Backend   | Node.js, Express 4, Mongoose 8            |
| Database  | MongoDB                                   |

---

## ✨ Features

- ✅ Add, edit, delete expenses
- ✅ 7 categories with color-coded badges
- ✅ Dashboard summary — total, monthly, weekly, count
- ✅ Category breakdown with progress bars
- ✅ Search & category filter
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications
- ✅ RESTful API with validation & error handling
- ✅ Pagination & sorting support
