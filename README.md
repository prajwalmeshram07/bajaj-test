# DeskFlow — Support Ticket Triage Board

A kanban-style support ticket management system with SLA tracking, priority badges, and status transition enforcement.

Built as part of a Bajaj assessment by **Prajwal Meshram** (0827CS231184).

---

## Live Links

- **Frontend (Netlify):** _TBD after deployment_
- **Backend (Render):** _TBD after deployment_

---

## Project Structure

```
bajaj-test/
├── backend/     Node.js + Express + MongoDB
└── frontend/    React + Vite
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/deskflow
PORT=5000
```

Run:

```bash
node server.js
```

---

## Frontend Setup

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

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /tickets | Create ticket |
| GET | /tickets | Get all tickets (supports ?status, ?priority, ?breached) |
| PATCH | /tickets/:id | Update ticket status |
| DELETE | /tickets/:id | Delete ticket |
| GET | /tickets/stats | Get summary stats |

---

## Status Transitions

```
open → in_progress → resolved → closed
(backward transitions also allowed one step at a time)
```

---

## SLA Targets

| Priority | Target |
|----------|--------|
| urgent | 1 hour |
| high | 4 hours |
| medium | 24 hours |
| low | 72 hours |

---

## Tech Stack

- **Frontend:** React, Vite, Axios, plain CSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Deployment:** Netlify (frontend), Render (backend)
