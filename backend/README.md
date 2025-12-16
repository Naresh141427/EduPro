# EduPro Backend

A robust Node.js backend API for user authentication and session management, built with Express.js, MySQL, and JWT tokens. This project provides secure authentication features including user registration, login, logout, and token refresh mechanisms.

## Features

- **User Registration**: Secure user signup with input validation and password hashing
- **User Login**: Credential-based authentication with session creation
- **JWT Authentication**: Access tokens for API authorization
- **Refresh Tokens**: Secure token rotation for extended sessions
- **Session Management**: Track user sessions with device and IP information
- **Password Security**: Bcrypt hashing for secure password storage
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error management with custom error classes
- **CORS Support**: Configured for frontend integration
- **Cookie-based Tokens**: Secure HTTP-only cookies for refresh tokens

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Database ORM**: mysql2 (promise-based)
- **UUID Generation**: uuid
- **Environment Management**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the `.env` file and update the values:
   ```bash
   cp .env.example .env  # If example exists, otherwise create .env
   ```

   Required environment variables:
   - `PORT`: Server port (default: 3000)
   - `DB_HOST`: MySQL host (default: localhost)
   - `DB_USER`: MySQL username
   - `DB_PASSWORD`: MySQL password
   - `DB_NAME`: MySQL database name
   - `DB_PORT`: MySQL port (default: 3306)
   - `JWT_SECRET`: Secret key for JWT signing (required in production)
   - `JWT_EXPIRES`: JWT expiration time (default: 15m)
   - `REFRESH_TOKEN_EXPIRES_DAYS`: Refresh token validity in days (default: 30)

4. **Set up the database**

   Create a MySQL database and run the following SQL to create the required tables:

   ```sql
   CREATE DATABASE edupro_database;

   USE edupro_database;

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       uuid VARCHAR(36) NOT NULL UNIQUE,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
       is_active BOOLEAN DEFAULT TRUE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE user_sessions (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_uuid VARCHAR(36) NOT NULL,
       refresh_token_hash VARCHAR(64) NOT NULL UNIQUE,
       user_agent TEXT,
       ip_address VARCHAR(45),
       expires_at TIMESTAMP NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
   );
   ```

## Usage

1. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000` (or the port specified in `.env`).

2. **API Base URL**
   ```
   http://localhost:3000/api/auth
   ```

## API Endpoints

### Authentication Routes

All routes are prefixed with `/api/auth`.

#### Register User
- **POST** `/signup`
- **Body**:
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "StrongPass123!",
    "confirmPassword": "StrongPass123!"
  }
  ```
- **Response**: User creation confirmation

#### Login
- **POST** `/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "StrongPass123!"
  }
  ```
- **Response**: Access token and user info (refresh token set in HTTP-only cookie)

#### Refresh Token
- **POST** `/refresh`
- **Headers**: Requires valid refresh token in cookies
- **Response**: New access token and updated refresh token

#### Logout
- **POST** `/logout`
- **Headers**: Requires valid refresh token in cookies
- **Response**: Clears refresh token cookie

## Authentication Middleware

To protect routes, use the `authMiddleware`:

```javascript
const authMiddleware = require('./middlewares/authMiddleware');

app.get('/protected', authMiddleware, (req, res) => {
  // Access req.user for authenticated user info
  res.json({ user: req.user });
});
```

## Project Structure

```
backend/
├── config/
│   ├── cookies.js      # Cookie configuration
│   ├── db.js           # Database connection
│   └── env.js          # Environment variables
├── controllers/
│   └── authController.js  # Authentication controllers
├── middlewares/
│   ├── authMiddleware.js  # JWT authentication middleware
│   ├── errorMiddleware.js # Global error handler
│   └── validators/
│       └── registerValidator.js # Input validation rules
├── models/
│   ├── sessionModel.js # Session database operations
│   └── userModel.js    # User database operations
├── routes/
│   └── authRoutes.js   # Authentication routes
├── services/
│   ├── authServices.js # Authentication business logic
│   ├── tokenServices.js # Token generation utilities
│   └── userServices.js # User management services
├── utils/
│   ├── AppError.js     # Custom error class
│   └── asyncHandler.js # Async error wrapper
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── package.json        # Dependencies and scripts
└── .env                # Environment variables
```

## Security Features

- **Password Hashing**: Uses bcrypt with salt rounds for secure password storage
- **JWT Tokens**: Short-lived access tokens (15 minutes default)
- **Refresh Tokens**: Long-lived tokens (30 days default) stored as hashed values
- **Session Tracking**: Monitors user sessions with device and IP information
- **Token Rotation**: Refresh tokens are rotated on each refresh for security
- **HTTP-Only Cookies**: Refresh tokens stored securely in HTTP-only cookies
- **CORS Configuration**: Properly configured for frontend integration
- **Input Validation**: Comprehensive validation to prevent malicious input

## Error Handling

The API uses a centralized error handling system:
- Custom `AppError` class for operational errors
- Global error middleware for consistent error responses
- Async error handling wrapper for clean controller code

## Development

- **Development Server**: `npm run dev` (uses nodemon for auto-restart)
- **Testing**: `npm test` (currently not implemented)
- **Linting**: Add ESLint configuration as needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For questions or issues, please open an issue in the repository.