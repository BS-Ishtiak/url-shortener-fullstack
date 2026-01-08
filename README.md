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

## Project Structure

```
url-shortener-fullstack/
├── url-shortener_api/                 # Backend (Express.js + TypeScript)
│   ├── src/
│   │   ├── app.ts                     # Express app setup
│   │   ├── server.ts                  # Server entry point
│   │   ├── config/                    # Configuration files
│   │   │   ├── database.ts            # Database connection
│   │   │   ├── env.ts                 # Environment variables
│   │   │   ├── jwt.ts                 # JWT configuration
│   │   │   └── swagger.ts             # Swagger/OpenAPI setup
│   │   ├── controllers/               # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── url.controller.ts
│   │   ├── services/                  # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── url.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── middlewares/               # Express middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── requestId.middleware.ts
│   │   │   └── security.middleware.ts
│   │   ├── routes/                    # Route definitions
│   │   │   ├── auth.routes.ts
│   │   │   └── url.routes.ts
│   │   ├── migrations/                # Database migrations
│   │   ├── types/                     # TypeScript type definitions
│   │   └── utils/                     # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
└── url-shortener_app/                 # Frontend (Next.js + React)
    ├── src/
    │   ├── app/                       # Next.js app directory
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── globals.css
    │   │   ├── auth/                  # Auth pages
    │   │   │   ├── login/
    │   │   │   └── signup/
    │   │   └── dashboard/             # Dashboard page
    │   ├── components/                # Reusable React components
    │   │   ├── common/                # Common UI components
    │   │   │   ├── Button.tsx
    │   │   │   ├── Input.tsx
    │   │   │   ├── LoadingSpinner.tsx
    │   │   │   └── ToastContainer.tsx
    │   │   ├── dashboard_items/       # Dashboard-specific components
    │   │   │   ├── URLForm.tsx
    │   │   │   ├── URLTable.tsx
    │   │   │   └── SearchFilter.tsx
    │   │   └── Dashboard.tsx
    │   ├── services/                  # API service layer
    │   │   ├── auth.service.ts
    │   │   └── url.service.ts
    │   ├── hooks/                     # Custom React hooks
    │   │   ├── useAsync.ts
    │   │   ├── useAuthGuard.ts
    │   │   └── useCopyToClipboard.ts
    │   ├── context/                   # React context for state
    │   │   ├── AuthContext.tsx
    │   │   ├── LoadingContext.tsx
    │   │   └── ToastContext.tsx
    │   ├── layouts/                   # Layout wrappers
    │   ├── config/                    # Configuration files
    │   └── types/                     # Type definitions
    ├── public/                        # Static assets
    ├── package.json
    ├── tsconfig.json
    └── next.config.ts
```

## API Documentation

Swagger UI available at:
http://localhost:5000/api-docs

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid-1234",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Log In
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid-1234",
      "email": "user@example.com"
    }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1234",
    "email": "user@example.com"
  }
}
```

### URL Endpoints

#### Create Short URL
```http
POST /api/urls
Authorization: Bearer {token}
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url/path",
  "customCode": "myurl"  // optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-5678",
    "originalUrl": "https://www.example.com/very/long/url/path",
    "shortCode": "myurl",
    "shortUrl": "http://localhost:5000/myurl",
    "createdAt": "2026-01-08T10:30:00Z",
    "clicks": 0
  }
}
```

#### Get All URLs
```http
GET /api/urls?page=1&limit=10&search=example
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "urls": [
      {
        "id": "uuid-5678",
        "originalUrl": "https://www.example.com/very/long/url/path",
        "shortCode": "myurl",
        "shortUrl": "http://localhost:5000/myurl",
        "createdAt": "2026-01-08T10:30:00Z",
        "clicks": 5
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

#### Get Single URL
```http
GET /api/urls/:id
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-5678",
    "originalUrl": "https://www.example.com/very/long/url/path",
    "shortCode": "myurl",
    "shortUrl": "http://localhost:5000/myurl",
    "createdAt": "2026-01-08T10:30:00Z",
    "clicks": 5
  }
}
```

#### Delete URL
```http
DELETE /api/urls/:id
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "URL deleted successfully"
}
```

#### Redirect to Original URL
```http
GET /:shortCode
```

**Response:** 301 Redirect to original URL

### Analytics Endpoints

#### Get URL Analytics
```http
GET /api/urls/:id/analytics
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-5678",
    "totalClicks": 5,
    "uniqueClicks": 3,
    "lastClicked": "2026-01-08T15:20:00Z",
    "clicksByDate": [
      {
        "date": "2026-01-08",
        "clicks": 5
      }
    ],
    "topReferrers": ["direct", "google.com"],
    "deviceTypes": ["desktop", "mobile"]
  }
}
```

#### Get Click History
```http
GET /api/urls/:id/clicks?limit=20
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "clicks": [
      {
        "id": "click-id-1",
        "timestamp": "2026-01-08T15:20:00Z",
        "userAgent": "Mozilla/5.0...",
        "ipAddress": "192.168.1.1",
        "referrer": "google.com"
      }
    ],
    "total": 5
  }
}
```

## Design Decisions

### Architecture
- **Separation of Concerns**: Controllers handle HTTP requests, services contain business logic, and repositories manage data access
- **Middleware-based**: Security, authentication, and error handling are implemented as reusable middleware
- **TypeScript**: Used for both frontend and backend for type safety and better developer experience

### Authentication
- **JWT with Refresh Tokens**: Implements stateless authentication with long-lived refresh tokens stored in httpOnly cookies
- **Bcrypt Hashing**: Passwords are hashed with bcrypt (12 rounds) for security

### Frontend State Management
- **React Context API**: Used for global state (authentication, loading, toast notifications) instead of Redux for simplicity
- **Custom Hooks**: Encapsulate logic like async operations (`useAsync`), clipboard operations (`useCopyToClipboard`)

### Database
- **PostgreSQL**: Chosen for ACID compliance and support for complex queries
- **Connection Pooling**: Implemented to manage database connections efficiently

### Real-time Updates
- **WebSocket**: Used for real-time click count updates on the dashboard
- **Polling Fallback**: If WebSocket is unavailable, the app falls back to HTTP polling

### API Design
- **RESTful**: Following REST conventions for predictable API structure
- **Pagination**: Implemented on list endpoints for scalability
- **Swagger/OpenAPI**: Full API documentation for easier integration

## Known Limitations

1. **Database Migrations**: Currently using a simple migration approach; more robust ORM (like Prisma or TypeORM) recommended for production
2. **Rate Limiting**: Not implemented; should be added for production to prevent abuse
3. **Analytics Data Retention**: Click data is stored indefinitely; consider implementing data archival for older analytics
4. **Custom Short Codes**: Limited validation; may need conflict detection for user-generated codes
5. **Email Verification**: Sign-up doesn't require email verification; recommended for production
6. **SSL/TLS**: Currently supports HTTP; HTTPS should be enforced in production
7. **Scalability**: WebSocket server is not clustered; Redis should be used for multi-instance deployments
8. **GDPR Compliance**: No data deletion policies or user consent management implemented
9. **Testing**: Limited test coverage; should add unit and integration tests before production deployment
10. **Logging**: Basic error logging only; comprehensive logging and monitoring (e.g., Winston, ELK stack) recommended

## Security

- Password hashing with bcrypt
- JWT-based authentication
- CORS restrictions
- Input validation
- Protection against SQL injection and XSS
- Secure headers (Helmet.js recommended)
- RequestID tracking for debugging

## Getting Started Checklist

- Clone the repository
- Setup backend .env
- Setup frontend .env.local
- Start backend and frontend servers
- Create an account and shorten a URL
