# TrackFlow – Business Requirements Document (BRD)

## 1. Project Information

**Project Name:** TrackFlow – Issue Tracker System  
**Project Type:** Web-Based Application  
**Frontend:** React.js  
**Backend:** Node.js and Express.js  
**Database:** MongoDB Atlas  

## 2. Project Overview

TrackFlow is a web-based issue management system designed to help users and administrators create, organize, assign and monitor issues efficiently.

The application provides secure authentication, role-based access, issue management, status tracking, comments and a dashboard displaying issue statistics.

## 3. Business Objectives

- Provide a centralized platform for managing issues.
- Allow administrators to assign issues to registered users.
- Enable users to track and update issue progress.
- Improve communication through issue comments.
- Provide a dashboard for monitoring issue statistics.

## 4. User Roles

### Administrator
- Login using administrator credentials.
- View all issues.
- Create, edit and delete permitted issues.
- Assign issues to registered users.
- Update issue statuses.
- View and add comments.
- Monitor dashboard statistics.

### Registered User
- Register and log in securely.
- Create issues.
- View issues they created or are assigned.
- Update permitted issue statuses.
- Add and view comments.
- View their dashboard statistics.

## 5. Functional Requirements

1. User registration and login.
2. Administrator authentication.
3. Create, edit and delete issues according to permissions.
4. Assign issues to registered users.
5. Track Open, In Progress and Closed statuses.
6. Set Low, Medium and High priority levels.
7. Add and view comments on issues.
8. Display total, open, in-progress and closed issue counts.
9. Search issues by title.
10. Protect API routes using JWT authentication.

## 6. Non-Functional Requirements

- Secure password storage using hashing.
- Authentication using JSON Web Tokens.
- Role-based access control.
- Responsive and user-friendly interface.
- Reliable database connectivity.
- Maintainable and modular code structure.
- Environment variables for sensitive configuration.

## 7. System Architecture

TrackFlow follows a client-server architecture.

**Frontend:** React.js provides the user interface and communicates with the backend through HTTP requests using Axios.

**Backend:** Node.js and Express.js handle authentication, authorization, issue management, comments and dashboard operations.

**Database:** MongoDB Atlas stores user accounts, issues and comments.

**Authentication:** JWT tokens authenticate protected API requests.

## 8. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS |
| Backend | Node.js |
| API Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcryptjs |
| HTTP Client | Axios |
| Icons | Lucide React |
| Version Control | Git and GitHub |

## 9. Database Overview

### Users
Stores user name, email, hashed password and role.

### Issues
Stores issue title, description, priority, status, creator and assigned user.

### Comments
Stores comment text, associated issue, user and timestamp.

## 10. Deployment

### Hosting Platforms

The planned deployment architecture is:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Source Code:** GitHub

### Deployment Approach

The frontend and backend are deployed separately. The React application communicates with the hosted Express API, while the backend connects to MongoDB Atlas.

### Required Services

- GitHub repository
- Vercel account
- Render account
- MongoDB Atlas database

### Deployment Steps

1. Upload the complete project to GitHub.
2. Create a MongoDB Atlas database and configure network access.
3. Deploy the backend folder as a Node.js web service on Render.
4. Configure the backend environment variables, including `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` and `PORT`.
5. Deploy the frontend folder on Vercel.
6. Configure the frontend API URL to point to the deployed Render backend.
7. Update backend CORS configuration to allow the Vercel frontend domain.
8. Test registration, login, issue creation, assignment, status updates, comments and dashboard statistics.
9. For future updates, push changes to GitHub and verify the corresponding deployment completes successfully.

### Deployment URLs

**Frontend URL:** To be added after Vercel deployment.

**Backend API URL:** To be added after Render deployment.

**GitHub Repository:** To be added after repository creation.

## 11. Expected Outcome

TrackFlow provides a centralized issue management platform where administrators and users can collaborate, assign responsibilities, monitor progress and communicate through comments.

The final deployed application will be accessible through a public web URL.

## 12. Conclusion

TrackFlow aims to simplify issue tracking through a secure, organized and user-friendly web application. Its role-based functionality, dashboard and collaboration features help users manage their work effectively.