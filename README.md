# Animal API with JWT Authentication

A RESTful API built with Node.js, Express, and TypeScript that manages animal records with JWT authentication.

## Features

- User authentication with JWT
- CRUD operations for animal records
- Input validation
- Error handling
- Docker support
- TypeScript for type safety

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (optional)

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

Create a `.env` file in the root directory with the following variables:

```env
PORT=3443
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Start the development server

```bash
npm run dev
```

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
