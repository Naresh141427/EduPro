# EduPro

EduPro is a comprehensive educational platform consisting of a backend API and frontend application for managing user authentication and educational content.

## Project Structure

- **backend/**: Node.js Express API server for authentication and data management
- **frontend/**: React/Vite frontend application (AI FRONTEND)

## Backend

The backend provides secure authentication services including user registration, login, logout, and token management.

### Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Session Management**: Secure session tracking with device and IP monitoring
- **Password Security**: Bcrypt hashing for secure password storage
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error management
- **CORS Support**: Configured for frontend integration

### Tech Stack

- Node.js
- Express.js
- MySQL
- JWT (JSON Web Tokens)
- bcrypt
- express-validator

### Quick Start

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by copying `.env` and updating values.

4. Create the MySQL database and tables (see backend/README.md for schema).

5. Start the development server:
   ```bash
   npm run dev
   ```

For detailed backend documentation, see [backend/README.md](backend/README.md).

## Frontend

The frontend is built with modern web technologies for an intuitive user experience.

*(Frontend documentation to be added)*

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Edupro
   ```

2. **Set up Backend** (see backend section above)

3. **Set up Frontend** (navigate to frontend directory and follow instructions)

4. **Run the applications**
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev` (assuming Vite setup)

## API Documentation

The backend API is documented in [backend/README.md](backend/README.md) with all available endpoints.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License