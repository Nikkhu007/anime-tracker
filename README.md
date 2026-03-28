# 🎌 Anime Tracker — Full Stack MERN App

A sleek, dark glassmorphism anime tracking web application built with MongoDB, Express, React, and Node.js.

---

## 📁 Folder Structure

```
anime-tracker/
├── server/                 # Node.js + Express backend
│   ├── models/
│   │   ├── User.js         # User schema (username, email, password)
│   │   └── Item.js         # Item schema (title, status, rating, userId)
│   ├── routes/
│   │   ├── auth.js         # POST /register, POST /login
│   │   └── items.js        # GET /items, POST /items, DELETE /items/:id
│   ├── middleware/
│   │   └── auth.js         # JWT protect middleware
│   ├── index.js            # Express app entry point
│   ├── .env.example        # Environment variable template
│   └── package.json
│
└── client/                 # React frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── index.js    # Axios instance + API call helpers
    │   ├── context/
    │   │   └── AuthContext.js  # Global auth state (JWT, user)
    │   ├── pages/
    │   │   ├── Auth.js     # Login / Signup page
    │   │   ├── Auth.css
    │   │   ├── Dashboard.js    # Main dashboard
    │   │   └── Dashboard.css
    │   ├── components/
    │   │   ├── AnimeCard.js    # Individual list card
    │   │   ├── AnimeCard.css
    │   │   ├── AddItemModal.js # Add anime modal
    │   │   └── AddItemModal.css
    │   ├── App.js          # Routing + protected routes
    │   ├── index.js        # React entry point
    │   └── index.css       # Global styles + CSS variables
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- **Node.js** v16+ ([nodejs.org](https://nodejs.org))
- **MongoDB** running locally ([mongodb.com](https://www.mongodb.com/try/download/community)) **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **npm** or **yarn**

---

### 1. Clone / Extract the Project

```bash
# If cloning from git:
git clone <repo-url>
cd anime-tracker

# Or just extract the zip and cd into it:
cd anime-tracker
```

---

### 2. Set Up the Backend (Server)

```bash
cd server
npm install
```

Create your `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/anime-tracker
JWT_SECRET=pick_a_long_random_secret_string_here
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/anime-tracker?retryWrites=true&w=majority`

Start the server:

```bash
# Development (auto-restart on save):
npm run dev

# Production:
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

### 3. Set Up the Frontend (Client)

Open a **new terminal** tab:

```bash
cd client
npm install
npm start
```

React will open at **http://localhost:3000** automatically.

---

### 4. Using the App

1. Go to **http://localhost:3000**
2. Click **Sign Up** and create an account
3. You'll be redirected to your **Dashboard**
4. Click **+ Add Anime** to add titles to your list
5. Filter by status using the filter bar
6. Hover over a card and click the 🗑 icon to delete

---

## 🔌 API Reference

All item endpoints require a `Authorization: Bearer <token>` header.

| Method | Endpoint             | Auth | Description               |
|--------|----------------------|------|---------------------------|
| POST   | `/api/register`      | ❌   | Register a new user        |
| POST   | `/api/login`         | ❌   | Login and receive JWT       |
| GET    | `/api/items`         | ✅   | Get all items for user     |
| POST   | `/api/items`         | ✅   | Add a new anime/movie      |
| DELETE | `/api/items/:id`     | ✅   | Delete an item by ID       |

### Request Bodies

**POST /api/register**
```json
{ "username": "string", "email": "string", "password": "string" }
```

**POST /api/login**
```json
{ "email": "string", "password": "string" }
```

**POST /api/items**
```json
{
  "title": "Attack on Titan",
  "status": "Watching",
  "rating": 9
}
```
- `status` must be one of: `"Watching"`, `"Completed"`, `"Plan to Watch"`
- `rating` is 0–10 (0 = unrated)

---

## 🛠️ Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | React 18, React Router v6, Axios      |
| Backend   | Node.js, Express 4                    |
| Database  | MongoDB + Mongoose                    |
| Auth      | JWT (jsonwebtoken) + bcryptjs         |
| Styling   | Pure CSS — dark glassmorphism theme   |

---

## 🎨 Features

- **Dark glassmorphism UI** with animated background orbs
- **JWT authentication** stored in localStorage
- **Protected routes** — dashboard only accessible when logged in
- **Filter by status** — All / Watching / Completed / Plan to Watch
- **Star rating system** — interactive 1–10 rating picker
- **Stats bar** — live counts per status category
- **Responsive** — works on mobile and desktop
- **Smooth animations** — staggered card reveals, hover effects

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (12 salt rounds)
- JWTs expire after **7 days**
- Each item is scoped to the authenticated user (`userId` check on delete)
- For production, set a strong `JWT_SECRET` and use HTTPS

---

## 📝 License

MIT — free to use and modify.
