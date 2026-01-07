# URLShort – Full Stack URL Shortener

URLShort is a modern SaaS-style URL shortening platform with authentication, analytics, and link management, built using Next.js and Express.js.

## Features

- Shorten long URLs into shareable links
- User authentication with JWT
- Dashboard for managing links
- Click tracking and analytics
- Search and pagination
- Real-time click count updates
- Responsive and mobile-friendly UI
- Secure backend with input validation and CORS

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Material UI
- Lucide Icons

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT Authentication
- Bcrypt
- Swagger / OpenAPI

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL
- Git

## Installation

### Backend Setup

```bash
cd url-shortener_api
npm install
npm run dev
```

If needed:
```bash
npm install --legacy-peer-deps
```

Create a .env file:
```
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener
DB_USER=postgres
DB_PASSWORD=1234

JWT_SECRET=dev_secret_key
CORS_ORIGINS=http://localhost:3000
```

Create database:
```bash
createdb url_shortener
```

Backend runs at: http://localhost:5000

### Frontend Setup

```bash
cd url-shortener_app
npm install
npm run dev
```

Create .env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Frontend runs at: http://localhost:3000

## API Documentation

Swagger UI available at:
http://localhost:5000/api-docs

## API Endpoints

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/refresh
POST /api/auth/logout
```

### URLs
```
POST   /api/urls
GET    /api/urls
GET    /api/urls/:id
DELETE /api/urls/:id
GET    /:shortCode
```

### Analytics
```
GET /api/urls/:id/analytics
GET /api/urls/:id/clicks
```

## Security

- Password hashing with bcrypt
- JWT-based authentication
- CORS restrictions
- Input validation
- Protection against SQL injection and XSS

## Getting Started Checklist

- Clone the repository
- Setup backend .env
- Setup frontend .env.local
- Start backend and frontend servers
- Create an account and shorten a URL
