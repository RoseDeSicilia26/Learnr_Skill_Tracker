# LEARNR_SKILL_TRACKER

The LEARNR_SKILL_TRACKER is an application designed to manage user interactions, track skills, and provide seamless communication between the frontend and backend services. Built on Node.js, this system is efficient, scalable, and easy to use.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [Function Descriptions](#function-descriptions)

## Installation

Follow the steps below to set up the project on your local machine:

1. **Node.js Installation**:
   - Download and install Node.js version (v18.17.1) from [Node.js official website](https://nodejs.org/en).
   - Use the recommended installation settings during the setup.

2. **Project Setup**:
   - Clone the repository to your local machine.
   - Navigate to the project directory in your terminal.

3. **Dependency Installation**:
   - If the following modules are not installed, you can download and install them by running the given commands:
     ```bash
     npm install express
     npm install bcrypt
     npm install csv-parser
     ```

## Getting Started

To get the application running:

1. Navigate to the project directory in your terminal.
2. Run the following command to start the server:
   ```bash
   node server.js
   ```

The application will start and run on localhost. Access the system via a web browser.

## Usage

1. Access the application via a browser using the URL `http://localhost:3000`.
2. Interact with the application as per your requirements.

## Directory Structure

```
LEARNR_SKILL_TRACKER/
│
├── Learnr/
│   ├── controllers/
│   │   └── userController.js - Manages communication between user views and models.
│   │
│   ├── models/
│   │   └── userModel.js - Handles user-related functions, primarily interacting with the CSV file.
│   │
│   ├── public/
│   │   └── LearnrLogin.js - Frontend logic for user login, interacts with the userController.
│   │
│   ├── routes/
│   │   └── authRoutes.js - Manages and routes incoming requests to their respective handlers.
│   │
│   └── views/
│       ├── admin/
│       │   └── supermentor.html - Represents the super mentor dashboard view.
│       ├── mentee/
│       │   └── mentee.html - Represents the mentee dashboard view.
│       ├── mentor/
│       │   └── mentor.html - Represents the mentor dashboard view.
│       ├── LearnrLogin Front.html - Main login view for the application.
│       └── NewUserForm.html - Registration form view.
│
└── server.js - The main server file to initiate the application.
```

## Function Descriptions

### **userController.js**
- `login(req, res)`: Logs in the user by checking their credentials against the CSV file and redirects them to the appropriate page.
- `register(req, res)`: Registers a user by checking the CSV for existing usernames and adds new users.
- `redirectToPage(permission, res)`: Redirects the user to their respective dashboard based on permissions.

### **userModel.js**
- `checkuser(username, password, callback)`: Validates if the user's credentials match any entry in the CSV file.
- `addUser(newUsername, newPassword, userType, callback)`: Writes new user data to the CSV file.
- `userExists(newUsername, callback)`: Checks if a username already exists in the CSV file.

### **LearnrLogin.js**
- Frontend event listener on the 'loginForm': Captures login form submission and calls the `login` function from the userController.

### **authRoutes.js**
- Provides routing for various endpoints such as login, registration, and different dashboards. It also serves the HTML files associated with each view.

### **server.js**
- Initiates the server, sets up middleware, and listens to the specified port.
