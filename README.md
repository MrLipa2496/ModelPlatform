# LipaX Platform

A role-based platform that connects models, agencies, and brands in a unified ecosystem. The application provides portfolio management, casting administration, application tracking, direct communication, and administrative moderation tools.

---

## Overview

LipaX is designed around three primary user groups:

- Models
- Agencies
- Administrators

The platform centralizes the talent management workflow, from portfolio creation and casting publication to application review and communication.

### Core Capabilities

- Portfolio and media management
- Casting creation and management
- Application tracking
- Direct invitations and messaging
- Administrative moderation
- Reporting and analytics

---

## Technology Stack

| Layer            | Technologies                    |
| ---------------- | ------------------------------- |
| Frontend         | React, Vite, React Router, Sass |
| Backend          | Node.js, Express                |
| Database         | PostgreSQL, Sequelize           |
| Authentication   | JWT, bcrypt                     |
| State Management | Redux Toolkit                   |
| Validation       | Formik, Yup                     |
| File Handling    | Multer                          |
| Reporting        | html-pdf-node, EJS              |
| Deployment       | Vercel, Render                  |
| Other Tools      | Axios, Winston, Git             |

---

## Architecture

### Backend

The backend follows a layered MVC architecture:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models (Sequelize)
  ↓
PostgreSQL
```

Responsibilities:

- Controllers handle HTTP requests and responses.
- Services contain business logic.
- Models manage database interaction.
- Middleware handles authentication, authorization, validation, and uploads.

### Frontend

The frontend follows a feature-oriented structure:

```text
Pages
  ↓
Components
  ↓
Redux Store
  ↓
API Layer
  ↓
Backend API
```

---

## Features

### Authentication

- User registration
- User login
- JWT authentication
- Protected routes
- Role-based access control

### Model Features

- Profile management
- Album management
- Photo uploads
- Casting applications
- Invitation management

### Agency Features

- Agency profile management
- Casting creation
- Application review
- Candidate selection
- Direct invitations

### Administration

- User management
- Verification workflows
- Report handling
- System monitoring

### Communication

- Internal messaging
- Invitation system
- Status tracking

---

## Project Structure

```text
lipax-platform/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── migrations/
    ├── models/
    ├── routers/
    ├── seeders/
    ├── services/
    ├── templates/
    ├── public/uploads/
    └── index.js
```

### Directory Overview

| Directory   | Purpose                        |
| ----------- | ------------------------------ |
| api         | API communication              |
| components  | Reusable UI components         |
| pages       | Route-level views              |
| store       | Redux configuration and slices |
| controllers | Request handlers               |
| services    | Business logic                 |
| models      | Database models                |
| middlewares | Authentication and validation  |
| migrations  | Database schema management     |

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd lipax-platform
```

### Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Configure Environment

Create a `.env` file inside the server directory.

### Run Application

Backend:

```bash
cd server
npm start
```

Frontend:

```bash
cd client
npm start
```

---

## Environment Variables

| Variable    | Description          |
| ----------- | -------------------- |
| PORT        | Application port     |
| HOST        | Host address         |
| NODE_ENV    | Runtime environment  |
| DB_HOST     | Database host        |
| DB_PORT     | Database port        |
| DB_USER     | Database username    |
| DB_PASSWORD | Database password    |
| DB_NAME     | Database name        |
| SECRET_KEY  | JWT secret           |
| SALT_ROUNDS | bcrypt configuration |

---

## Database

### Main Entities

- User
- Model
- Agency
- Casting
- Application
- Invitation
- Album
- Photo
- Message
- Report

### Relationships

```text
Agency
   │
   ├── Castings
   │      │
   │      └── Applications
   │               │
   │               └── Models
   │
   └── Invitations
```

---

## API Modules

| Route         | Purpose            |
| ------------- | ------------------ |
| /auth         | Authentication     |
| /model        | Model operations   |
| /agency       | Agency operations  |
| /albums       | Album management   |
| /castings     | Casting management |
| /applications | Applications       |
| /invitations  | Invitations        |
| /messages     | Messaging          |
| /admin        | Administration     |
| /reports      | Reporting          |

---

## Security

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- File type validation
- Server-side access control

---

## Error Handling

### Backend

- Centralized Express error middleware
- Custom error classes
- Structured logging via Winston

### Frontend

- Axios interceptors
- User-friendly notifications
- Request failure handling

---

## Deployment

### Frontend

- Vercel

### Backend

- Render or Node.js hosting

### Database

- PostgreSQL
- Neon or managed PostgreSQL provider

---

## Future Improvements

- Real-time chat with WebSockets
- Push notifications
- Cloud object storage
- Automated testing
- CI/CD pipelines
- End-to-end testing

---

## Contributing

1. Create a feature branch.
2. Implement changes.
3. Commit using conventional commits.
4. Open a pull request targeting the development branch.

---

## License

Proprietary software. All rights reserved.

---

## Author

Oleksandr Lipchanskyi

GitHub: https://github.com/MrLipa2496
