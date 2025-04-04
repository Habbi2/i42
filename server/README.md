# Task Manager API

This is the back-end server for the Task Manager application. It provides RESTful APIs for managing tasks and user authentication.

## Features

- User registration and authentication
- Task creation, retrieval, updating, and deletion
- Middleware for authentication and validation
- MongoDB integration for data storage

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (for database)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd task-manager/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `server` directory and add the following:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

### Running the Server

To start the server, run:
```
npm start
```

The server will run on `http://localhost:5000`.

### API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Log in an existing user

- **Tasks**
  - `GET /api/tasks` - Retrieve all tasks
  - `POST /api/tasks` - Create a new task
  - `GET /api/tasks/:id` - Retrieve a specific task
  - `PUT /api/tasks/:id` - Update a specific task
  - `DELETE /api/tasks/:id` - Delete a specific task

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.