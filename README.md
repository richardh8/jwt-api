# JWT Authentication API

A secure RESTful API built with Node.js, Express, and TypeScript featuring JWT authentication, rate limiting, and HTTPS support.

## ✨ Features

- 🔒 Secure JWT authentication
- 🚀 Built with TypeScript for type safety
- 🐳 Docker containerization
- 🔄 Automatic HTTPS with self-signed certificates (development)
- ⚡ Rate limiting and request validation
- 🔄 CORS support
- 📝 API documentation (Swagger)
- 🧪 Unit and integration tests

## 🚀 Prerequisites

- Node.js v18 or higher
- npm or Yarn
- Docker & Docker Compose (for containerization)
- OpenSSL (for generating SSL certificates)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3444
NODE_ENV=development

# JWT
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=1h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # Max requests per window

# CORS
CORS_ORIGIN=http://localhost:3000,https://localhost:3444

# Security
NODE_TLS_REJECT_UNAUTHORIZED=0  # Only for development
```

### 4. Generate SSL Certificates (Development)

```bash
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/localhost.key \
  -out ssl/localhost.crt \
  -subj "/CN=localhost"
```

### 5. Start with Docker (Recommended)

```bash
docker-compose up --build
```

Or run locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile (requires auth)

### Animals
- `GET /api/animals` - Get all animals (public)
- `POST /api/animals` - Create new animal (requires auth)
- `GET /api/animals/:id` - Get animal by ID (public)
- `PUT /api/animals/:id` - Update animal (requires auth)
- `DELETE /api/animals/:id` - Delete animal (requires admin)

## 🔒 Authentication

Include the JWT token in the `Authorization` header:
```
Authorization: Bearer your-jwt-token-here
```

## 🛠 Development

```bash
# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

MIT

The API will be available at `http://localhost:6677`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Animals

- `GET /api/animals` - Get all animals
- `GET /api/animals/:id` - Get a single animal by ID
- `POST /api/animals` - Create a new animal (requires authentication)
- `PUT /api/animals/:id` - Update an animal (requires authentication)
- `DELETE /api/animals/:id` - Delete an animal (requires authentication)

## Running with Docker

### Build and run with Docker Compose

```bash
docker-compose up --build
```

The API will be available at `http://localhost:6677`

### Build the Docker image

```bash
docker build -t animal-api .
```

### Run the Docker container

```bash
docker run -p 6677:6677 animal-api
```

## Testing

### Run tests

```bash
npm test
```

## Project Structure

```
src/
├── controllers/      # Route controllers
├── middleware/      # Custom middleware
├── models/          # Data models
├── routes/          # Route definitions
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── validations/     # Request validation schemas
```

## Authentication

To access protected routes, include the JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Example Requests

### Register a new user

```bash
curl -X POST http://localhost:6677/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### Login

```bash
curl -X POST http://localhost:6677/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### Create a new animal

```bash
curl -X POST http://localhost:6677/api/animals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name": "Leo", "species": "Lion", "age": 5, "gender": "Male", "race": "African Lion"}'
```

## License

This project is licensed under the MIT License.
