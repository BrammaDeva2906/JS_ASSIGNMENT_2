# JavaScript Frameworks - Assignment II

Three independent applications in one workspace. Each question has its own client and server.

| Folder | Stack | Client | API |
|---|---|---:|---:|
| `Question_1_Student_Management` | MERN | 3000 | 5000 |
| `Question_2_Online_Bookstore` | MERN | 3001 | 5001 |
| `Question_3_Course_Registration` | MEAN | 4200 | 5002 |

## Requirements
- Node.js 18+ and npm
- MongoDB running locally, or a MongoDB Atlas connection string
- Angular CLI is not required; use the scripts below.

## Setup
For each project, open two terminals. In the `server` folder run `npm install` then `npm run dev`. In the `client` folder run `npm install` then `npm run dev` (Q3 uses `npm start`).

Example Q1:
```bash
cd Question_1_Student_Management/server
cp .env.example .env
npm install && npm run dev
```
In another terminal:
```bash
cd Question_1_Student_Management/client
npm install && npm run dev
```
Repeat for Q2 and Q3. Each server has an in-memory fallback when MongoDB is unavailable, so the API can still be demonstrated. Fallback data resets when the server restarts. For persistent data, configure `MONGO_URI` in each server's `.env`.

## Features
- Q1: Create, view, edit and delete student records; search and summary counts.
- Q2: Browse and search books by title/author; add, edit, delete and track availability/stock.
- Q3: Register/cancel course enrolments; reactive validation, capacity and remaining-seat tracking.

Each application has a deliberately different visual identity and layout. No project shares its UI components or styling with the others.
