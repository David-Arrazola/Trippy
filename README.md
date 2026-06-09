# Trippy Monorepo

This repository is structured as an npm workspaces monorepo.

## Structure

- `frontend`: client app workspace
- `backend`: server app workspace

## Getting started

1. Install dependencies from the repo root:
   - `npm install`
2. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env` and fill in values
   - Copy `frontend/.env.example` to `frontend/.env` and fill in values
   - **Required for auth:** `MONGODB_URI` and `JWT_SECRET` in the backend `.env`
3. Start MongoDB locally (or use MongoDB Atlas and set `MONGODB_URI`)
4. Run both workspaces in dev mode:
   - `npm run dev`

## Auth & saved trips

- Register / log in from the navbar
- After generating a trip, use **Save trip** on the results page
- View saved trips at **My Trips**
- Toggle **Share** to generate a public link friends can open at `/share/:shareId`

## Individual workspace scripts

- Frontend only: `npm run dev:frontend`
- Backend only: `npm run dev:backend`