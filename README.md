# DeskFlow — Support Ticket Triage Board

A kanban-style support ticket management system with SLA tracking, priority badges, and status transition enforcement.

Built as part of a Bajaj assessment by **Prajwal Meshram** (0827CS231184).

---

## Live Links

- **Frontend (Netlify):** https://deskflow-prajwal.netlify.app
- **Backend (Render):** https://deskflow-backend.onrender.com _(deploy to get actual URL)_

---

## Project Structure

```
bajaj-test/
├── backend/     Node.js + Express + MongoDB
└── frontend/    React + Vite
```

---

## Backend Setup (Local)

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/deskflow
PORT=5000
```

Run:

```bash
node server.js
```

---

## Frontend Setup (Local)

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

---

## Backend Deployment (Render)

1. Go to https://render.com → New → Web Service
2. Connect this GitHub repo
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `PORT` = `5000`
5. Copy the deployed URL and set it as `VITE_API_URL` in your Netlify site env vars

---

## Frontend Deployment (Netlify)

Already deployed at: https://deskflow-prajwal.netlify.app

To redeploy after backend URL is confirmed:
1. Go to Netlify → Site settings → Environment variables
2. Update `VITE_API_URL` to your Render backend URL
3. Trigger a new deploy

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /tickets | Create ticket |
| GET | /tickets | List tickets (supports `?status=`, `?priority=`, `?breached=true`) |
| PATCH | /tickets/:id | Update ticket status |
| DELETE | /tickets/:id | Delete ticket |
| GET | /tickets/stats | Get summary stats |

---

## Status Transitions

```
open → in_progress → resolved → closed
(backward one step at a time: closed → resolved → in_progress → open)
```

---

## SLA Targets

| Priority | Target |
|----------|--------|
| urgent   | 1 hour |
| high     | 4 hours |
| medium   | 24 hours |
| low      | 72 hours |

---

## Tech Stack

- **Frontend:** React, Vite, Axios, plain CSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Deployment:** Netlify (frontend), Render (backend)
