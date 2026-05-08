# 🚀 TaskFlow Backend

TaskFlow is a robust, production-ready NestJS backend designed for high-performance task management and workflow automation. It features a scalable architecture, integrated authentication, and comprehensive API documentation.

[![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![License](https://img.shields.io/badge/License-UNLICENSED-blue.svg)](LICENSE)

---

## ✨ Key Features

- 🔐 **Secure Authentication**: JWT-based auth with refresh token logic and Passport.js integration.
- 📂 **Account Management**: User profile management and account settings.
- 🛠️ **Task Management**: Core logic for creating, updating, and tracking tasks.
- 🛡️ **Admin Dashboard**: Specialized endpoints for administrative oversight.
- 🔔 **Notifications**: Multi-channel notification system (Firebase integration).
- 🌍 **I18n Support**: Internationalized validation messages and responses.
- 📈 **Monitoring**: Health checks and Winston-powered daily rotating logs.
- 📚 **Swagger API Docs**: Interactive API documentation at `/api/docs`.

---

## 🛠️ Tech Stack

- **Core**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Caching & Rate Limiting**: [Redis](https://redis.io/)
- **Authentication**: [Passport.js](https://www.passportjs.org/) & [JWT](https://jwt.io/)
- **Validation**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
- **Logging**: [Winston](https://github.com/winstonjs/winston)
- **Internationalization**: [nestjs-i18n](https://github.com/Toon_Van_Den_Bosch/nestjs-i18n)
- **Documentation**: [Swagger / OpenAPI](https://swagger.io/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or later
- **MongoDB**: A running instance or Atlas cluster
- **Redis**: A running instance (optional but recommended for rate limiting)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sandeshsonel/taskflow-nest-backend
   cd taskflow-nest-backend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   _Edit `.env` and fill in your configuration details (MongoDB URI, JWT secrets, etc.)._

### Running the Application

```bash
# Development mode
npm run start:dev

# Debug mode
npm run start:debug

# Production mode
npm run build
npm run start:prod
```

---

## 📖 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
🔗 [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

All API endpoints are prefixed with `/api/v1` (e.g., `http://localhost:8000/api/v1/auth/login`).

---

## 📂 Project Structure

```text
src/
├── common/         # Global guards, filters, pipes, and swagger config
├── config/         # Environment and application configuration
├── modules/        # Feature modules (auth, task, user, etc.)
│   ├── auth/       # Authentication logic
│   ├── task/       # Task management
│   ├── account/    # User profiles
│   └── ...         # Other modules
├── utils/          # Shared utility functions
├── main.ts         # Application entry point
└── app.module.ts   # Root application module
```

---

## 📜 Available Scripts

- `npm run build`: Build the application for production.
- `npm run start:dev`: Start the application in watch mode for development.
- `npm run test`: Run unit tests using Jest.
- `npm run lint`: Lint and fix code using ESLint.
- `npm run format`: Format code using Prettier.

---

## 📄 License

This project is [UNLICENSED](LICENSE).
