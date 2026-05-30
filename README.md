# Dhruv Pal — Portfolio (MERN Stack)

A production-ready MERN stack portfolio application converted from a single-page HTML prototype.

## Architecture

```
├── frontend/          # React 19 + Vite + Tailwind CSS v4
│   └── src/
│       ├── components/    # Reusable UI components
│       │   ├── common/    # Cursor, ScrollProgress, ScrollReveal, etc.
│       │   ├── layout/    # Navbar, Footer
│       │   ├── sections/  # Hero, About, Skills, Projects, etc.
│       │   └── ui/        # Pill, Tag, Cards, etc.
│       ├── constants/     # Static data fallback
│       ├── hooks/         # useScrollProgress, useMousePosition, etc.
│       ├── layouts/       # RootLayout
│       ├── pages/         # Home, About, Projects, Contact, 404
│       ├── routes/        # React Router config
│       └── services/      # Axios API layer
│
├── backend/           # Express.js + MongoDB + Mongoose
│   └── src/
│       ├── config/        # Database connection
│       ├── controllers/   # Request handlers
│       ├── middlewares/    # Error handler, validation
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API routes
│       ├── services/      # Business logic
│       ├── utils/         # ApiError, ApiResponse, asyncHandler
│       └── validators/    # Request validation rules
```

## Tech Stack

| Layer     | Technologies                                                |
|-----------|-------------------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, Framer Motion, React Router, Zustand |
| Backend   | Node.js, Express.js, MongoDB, Mongoose                      |
| Forms     | React Hook Form + Express Validator                         |
| HTTP      | Axios                                                       |
| Security  | Helmet, CORS, Rate Limiting                                 |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env     # Edit with your MongoDB URI
npm install
npm run seed             # Populate database with portfolio data
npm run dev              # Start server on :5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # Start Vite on :5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The frontend works standalone without the backend running — it falls back to static data from `src/constants/data.js`.

## API Documentation

| Method   | Endpoint               | Description              |
|----------|------------------------|--------------------------|
| `GET`    | `/api/health`          | Health check             |
| `GET`    | `/api/projects`        | Get all projects         |
| `GET`    | `/api/projects/featured` | Get featured project   |
| `GET`    | `/api/experience`      | Get all experience       |
| `GET`    | `/api/skills`          | Get all skills           |
| `GET`    | `/api/achievements`    | Get all achievements     |
| `GET`    | `/api/config`          | Get site configuration   |
| `POST`   | `/api/contact`         | Submit contact form      |

### Response Format

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

## Environment Variables

### Backend (`.env`)
| Variable            | Default                           | Description            |
|---------------------|-----------------------------------|------------------------|
| `NODE_ENV`          | `development`                     | Environment mode       |
| `PORT`              | `5000`                            | Server port            |
| `MONGODB_URI`       | `mongodb://localhost:27017/dhruv-portfolio` | MongoDB connection |
| `CORS_ORIGIN`       | `http://localhost:5173`           | Allowed CORS origin    |
| `RATE_LIMIT_WINDOW_MS` | `900000`                       | Rate limit window (ms) |
| `RATE_LIMIT_MAX`    | `100`                             | Max requests per window|

### Frontend (`.env`)
| Variable         | Default                        | Description    |
|------------------|--------------------------------|----------------|
| `VITE_API_URL`   | `http://localhost:5000/api`    | Backend API URL|

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build    # Output in dist/
# Deploy dist/ to Vercel, Netlify, or any static host
```

### Backend (Railway / Render)
- Set environment variables
- Entry point: `src/server.js`
- Build command: `npm install`
- Start command: `npm start`

## License

ISC © Dhruv Pal
