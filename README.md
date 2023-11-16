# Learnr

The Learnr is an application designed to manage user interactions, track skills, and provide seamless communication between the frontend and backend services.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [Backend File Function Descriptions](#backend_file_function_drescription)

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
     npm install mysql2
     npm install @azure/msal-node
     npm install ejs
     ```

4. **MySQL Setup**:
   - Download mySQL from this website: https://dev.mysql.com/downloads/installer/
      - For windows select the download with the higher download count.
      - For mac select the option that works for your specified operating system. 
   - Once downloaded use all default settings and when it asks to enter a password type the recommended: 'root' or 'password' (This passowrd may vary from computer to computer).
   - If possible do a full installation which will include mysql workbench and mysql sever.
      - Run mySQL workbench and select the database and log in using the password you set for yourself.


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
│   │   └── userController.js - Manages user operations and interactions between the user models and views.
│   │
│   ├── models/
│   │   ├── database.js - Centralized database connection settings and functions.
│   │   ├── msalConfig.js - Configuration for Microsoft Authentication Library (MSAL).
│   │   ├── pathwaysModel.js - Manages learning pathway data interactions with the database.
│   │   └── userModel.js - Handles user data and logic, interfacing with the database.
│   │
│   ├── public/
│   │   ├── icons/ - Contains image assets used across the front-end.
│   │   ├── LearnrLogin.js - Front-end logic for handling user authentication and login.
│   │   ├── Pathways.js - Front-end scripts for learning pathways interaction.
│   │   └── Profile.js - Script for handling user profile interactions on the front-end.
│   │
│   ├── routes/
│   │   └── authRoutes.js - Routes authentication and authorization requests.
│   │
│   ├── views/
│   │   ├── admin/
│   │   │   ├── supermentor-deletePathway.ejs - View for deleting learning pathways by a super mentor.
│   │   │   ├── supermentor-management.html - Admin panel for super mentor management tasks.
│   │   │   ├── supermentor-mentee_pathway_tracker.ejs - Tracks mentee progress for super mentors.
│   │   │   └── supermentor-profile.ejs - Profile view template for super mentors.
│   │   │
│   │   ├── mentee/
│   │   │   ├── empty_pathways_tracker.html - View displayed when there are no pathways to track.
│   │   │   ├── mentee-profile.ejs - Profile view for mentees.
│   │   │   ├── user_pathways_tracker.ejs - View for tracking assigned learning pathways.
│   │   │   └── user_skill_tracker.ejs - Skill tracking interface for mentees.
│   │   │
│   │   ├── mentor/
│   │   │   ├── assignForm.ejs - Form for mentors to assign tasks or pathways.
│   │   │   ├── mentor-management.html - Management view for mentors.
│   │   │   ├── mentor-mentee_pathway_tracker.ejs - Interface for mentors to track mentee pathway progress.
│   │   │   └── mentor-profile.ejs - Profile view for mentors.
│   │   │
│   │   ├── assignForm.html - HTML form for assigning new tasks or pathways.
│   │   ├── createPathwayForm.html - Form for creating new learning pathways.
│   │   ├── LearnrLogin Front.html - Front-end for the Learnr login page.
│   │   ├── NewUserForm.html - Form for registering new users.
│   │   └── ResetUserPasswordForm.html - Form for users to reset their passwords.
│   │
│   └── server.js - Initializes and starts the application server.
│
├── database files/
│   └── SQL Workbench Files/ - Contains SQL scripts and database workbench files for managing the database schema and data.
│
└── README.md - Project documentation and setup guide.

```


# Backend File Function Descriptions

## **userController.js**

The `userController.js` module is responsible for handling all user-related operations within the application, mediating between the views and models.

### Functions

- `handlePathways(req, res)`: Manages the assignment of learning pathways to mentees, including validation and the creation of new mentee-pathway relationships.

- `assign(req, res)`: Renders the assignment form to the user, populated with mentees and pathways data.

- `assignPathway(req, res)`: Assigns a selected pathway to a chosen mentee and handles potential errors in assignment.

- `login(req, res)`: Authenticates a user by verifying their credentials and redirects them to their respective dashboard.

- `logout(req, res)`: Resets the current session's user information, effectively logging out the user.

- `getProfile(req, res)`: Retrieves and renders the profile data for the logged-in user.

- `getPathwayData(req, res)`: Retrieves and renders the pathway data for a specific course ID for the logged-in mentee.

- `getUserDashboard(req, res)`: Determines the user type of the logged-in user and renders the appropriate dashboard.

- `verifyIsAdmin(req, res)`: Checks if the logged-in user is an admin.

- `updateProfile(req, res)`: Updates the profile information of the logged-in user and handles profile update operations.

- `checkIfLoggedIn(req, res, next)`: Middleware that checks if the user is logged in before allowing access to certain routes.

- `admin_reset_password(req, res)`: Allows an admin to reset a user's password and handles the password reset process.

- `register(req, res)`: Handles new user registration, ensuring the email doesn't already exist and saving the new user information.

- `redirectToPage(req, res)`: Redirects the logged-in user to their respective dashboard based on their user type and admin status.

- `validateRoute(routeType)`: Middleware that validates the user's permission for accessing specific routes based on their user type.

- `msalLogin(req, res)`: Authenticates a user using Microsoft Authentication Library (MSAL) and handles the login response.

- `getPathways(req, res)`: Retrieves all pathways data for display and management by an admin.

- `removePathway(req, res)`: Disables and removes a pathway based on a given pathway ID, handling errors related to pathway removal.

### Global Variables

- `accountEmail`: Keeps track of the currently logged-in user's email address.
- `accountUserType`: Stores the user type of the currently logged-in user.
- `accountIsAdmin`: Indicates whether the currently logged-in user has admin privileges (1 for admin, 0 for non-admin).


## **userModel.js**

The `userModel.js` module is designed to interact with the database for user-related data management, such as authentication, profile updates, and registration.

### Functions

- `login_msal(callback)`: Initiates a login flow using Microsoft Authentication Library (MSAL).

- `checkUser(email, password, callback)`: Verifies if user credentials match those in the database and retrieves the user type and admin status.

- `validateEmail(email, callback)`: Checks if the provided email exists in the database.

- `addUser(newEmail, newPassword, userType, name, position, callback)`: Adds a new user to the database with the provided details.

- `getUserData(email, callback)`: Retrieves full user profile data based on the user's email.

- `updateProfile(email, firstName, lastName, position, bio, school, interests, callback)`: Updates the user's profile information in the database.

- `adminUpdatePassword(email, newPassword, callback)`: Allows an admin to update a user's password in the database.

- `getMentees(callback)`: Retrieves a list of all users with the 'mentee' user type from the database.


## **pathwaysModel.js**

The `pathwaysModel.js` module manages the interactions with the database for operations related to learning pathways within the application.

### Functions

- `getPathwaySkill(pathwayID, callback)`: Retrieves the skill associated with a given pathway ID from the database.

- `addPathway(pathwayID, menteeEmail, callback)`: Adds a new pathway assignment for a mentee in the database.

- `checkPathway(pathwayID, menteeEmail, callback)`: Checks if a pathway assignment already exists for a mentee.

- `getMentorMentees(mentorEmail, callback)`: Retrieves all mentees and their pathway progress associated with a specific mentor.

- `getMenteePathwaysAll(menteeEmail, callback)`: Retrieves all pathway assignments for a specific mentee.

- `getMenteePathwaysSingle(menteeEmail, pathway_id, callback)`: Retrieves a single pathway assignment for a mentee.

- `getPathwaySkills(pathwayID, callback)`: Retrieves all skills associated with a specific pathway.

- `validatePathwayID(pathwayID, callback)`: Validates the existence of a pathway ID in the database.

- `removePathway(pathwayID, callback)`: Removes a pathway assignment from the database.

- `disablePathway(pathwayID, callback)`: Sets a pathway as disabled in the database.

- `getPathways(callback)`: Retrieves all pathways from the database.


## **database.js**

The `database.js` module establishes and manages the connection to the MySQL database used by the application.

### Setup

- A MySQL connection is created using the `mysql2` package. You will need to update the host, port, user, password, and database name with your MySQL server's details.

### Connection Handling

- `connectToMySQL()`: A function that establishes a connection to the MySQL server and logs any errors or confirms a successful connection.

- Connection Event Listener: Listens for a 'PROTOCOL_CONNECTION_LOST' error and attempts to reconnect to the MySQL server if the connection is lost.

- Exit Event Listener: Ensures that the MySQL connection is properly closed when the application process exits.

### Export

- The established connection is exported so that it can be utilized by other modules within the application.


## **LearnrLogin.js**
- Frontend event listener on the 'loginForm': Captures login form submission and calls the `login` function from the userController.


## **authRoutes.js**

The `authRoutes.js` file is responsible for defining the route handlers for authentication and user management within the LEARNR_SKILL_TRACKER application.

### Route Handlers

- `GET /`: Serves the main login page to the user.

- `POST /login`: Handles user login requests using the `login` function from `userController`.

- `GET /logout`: Logs out the user and redirects to the login page.

- `GET /management`: Serves the management dashboard for mentors and admin users based on their permissions.

- `GET /skill_tracker`: Serves the skill tracker page for mentees.

- `GET /pathways/pathway_:courseId`: Retrieves and displays pathway data for the given course ID.

- `GET /profile`, `POST /updateProfile`: Retrieves and updates the profile of the logged-in user.

- `GET /dashboard`: Directs the user to their respective dashboard after login.

- `GET /admin`, `GET /mentor`, `GET /mentee`: Directs admin, mentor, and mentee users to their respective dashboards.

- `GET /register`, `POST /register`: Displays the registration form to the admin and handles the registration process.

- `GET /user/profile`: Retrieves the profile information for display.

- `GET /admin_reset_password`, `POST /admin_reset_password`: Serves the password reset form for admins and handles the password reset process.

- `GET /assign`, `POST /assignPathway`: Displays the pathway assignment form to the user and handles the assignment of pathways to mentees.

- `GET /getPathways`: Retrieves all pathways data for management by an admin.

- `POST /removePathway`: Handles the removal of a pathway assignment from the system.

- `GET /msal`: Initiates the login process using Microsoft Authentication Library (MSAL).

### Middleware Usage

- `userController.checkIfLoggedIn`: Middleware to check if a user is logged in before accessing certain routes.
- `userController.validateRoute(routeType)`: Middleware to validate if the logged-in user has the permission to access specific routes.

### Export

- The `router` object is exported for use in the main `server.js` application file.


## **server.js**

The `server.js` file is the entry point for the LEARNR_SKILL_TRACKER web application. It sets up the server and includes the necessary middleware to handle requests and static files.

### Setup

- **Express Framework**: Initializes an Express application to set up the server.
- **Body Parser Middleware**: Uses `body-parser` to parse JSON and URL-encoded form data.
- **Static Files**: Serves static files from the 'public' directory.

### Port Configuration

- The application listens on port `3000`, which can be configured as needed for your environment.

### Routing

- **Authentication Routes**: Includes and uses the authentication routes defined in `authRoutes.js` for handling login, registration, and other auth-related endpoints.

### Server Initialization

- The server is started and begins listening on the specified port, logging a message to the console to indicate that it is running and available for connections.

### Usage

To start the server, run `node server.js` in the terminal. Ensure all other configurations, such as database connections, are set up correctly beforehand.

