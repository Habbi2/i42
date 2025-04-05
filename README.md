# Task Manager Application

This is a task management web application that allows users to create, update, and manage their tasks efficiently. The application is built using a React front-end and a Node.js back-end.

## Project Structure

The project is divided into two main parts: the client (front-end) and the server (back-end).

### Client

- **client/public/index.html**: The main HTML file that serves as the entry point for the front-end application.
- **client/public/favicon.svg**: The favicon for the application.
- **client/src/assets**: Contains static assets such as images and stylesheets.
- **client/src/components**: Contains reusable components for the application.
  - **common**: Common components like Button, Input, and Navbar.
  - **tasks**: Components related to task management, including TaskCard, TaskForm, and TaskList.
  - **auth**: Components for user authentication, including LoginForm and RegisterForm.
- **client/src/pages**: Contains the main pages of the application, such as Home, Dashboard, TaskDetails, and Auth.
- **client/src/context**: Context providers for managing authentication and task-related state.
- **client/src/services**: Functions for making API calls related to tasks and authentication.
- **client/src/utils**: Utility functions that can be used throughout the application.
- **client/src/App.jsx**: The main application component that sets up routing and context providers.
- **client/src/main.jsx**: The entry point for the React application.
- **client/package.json**: Configuration file for the front-end application.
- **client/vite.config.js**: Configuration settings for Vite, the build tool used for the front-end.
- **client/README.md**: Documentation for the front-end application.

### Server

- **server/src/controllers**: Contains controllers for handling requests related to authentication, tasks, and users.
- **server/src/models**: Defines the schema and methods for Task and User objects.
- **server/src/routes**: Contains routes for authentication, task management, and user management.
- **server/src/middleware**: Middleware functions for authentication checks and request validation.
- **server/src/config**: Contains database connection logic and environment variable management.
- **server/src/utils**: Utility functions for the server-side application.
- **server/src/app.js**: The main entry point for the server application.
- **server/package.json**: Configuration file for the back-end application.
- **server/README.md**: Documentation for the back-end application.

### Root

- **package.json**: Configuration file for the overall project.
- **README.md**: Documentation for the entire project.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the client directory and install dependencies:
   ```
   cd client
   npm install
   ```

3. Navigate to the server directory and install dependencies:
   ```
   cd server
   npm install
   ```

3. Run all tests from the root directory:
   ```
   npm test
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd client
   npm run dev
   ```

### Running Tests

1. Run server-side tests:
```
npm test
```

2. Run client-side tests:
```
npm test
```

### Usage

- Access the application in your browser at `http://localhost:3000` (or the port specified in your server configuration).
- Use the application to manage your tasks, including creating, updating, and deleting tasks.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.