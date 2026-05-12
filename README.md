# TaskFlow Backend

TaskFlow is a production-grade NestJS backend service for task management and workflow automation. It implements a scalable architecture with a focus on maintainability, performance, and clear API contracts.

## Architecture & Tech Stack

- **Framework**: NestJS (TypeScript)
- **Data Store**: MongoDB via Mongoose
- **Caching & Rate Limiting**: Redis
- **Authentication**: JWT with refresh token rotation (Passport.js)
- **Validation**: class-validator & class-transformer
- **Observability**: Winston (daily rotating logs), integrated health checks
- **API Design**: Swagger/OpenAPI for documentation
- **Internationalization**: nestjs-i18n for localized API responses

## System Capabilities

- **Authentication & Authorization**: Secure JWT-based access with role-based access control (RBAC).
- **Task Management**: Lifecycle tracking, assignment, and status updates.
- **Account Management**: User profile and preference handling.
- **Admin Operations**: Elevated privileges for system-wide oversight.
- **Asynchronous Notifications**: Multi-channel delivery system including Firebase integration.

## Local Development

### Prerequisites

- Node.js (v20+)
- MongoDB (local instance or Atlas cluster)
- Redis (required for caching and rate limiting)
- pnpm (recommended) or npm

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sandeshsonel/taskflow-nest-backend
   cd taskflow-nest-backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure the environment:**
   ```bash
   cp .env.example .env
   ```
   *Update the `.env` file with the appropriate MongoDB URI, Redis connection details, and JWT secrets.*

### Execution

```bash
# Watch mode for development
npm run start:dev

# Debug mode
npm run start:debug

# Production build and execution
npm run build
npm run start:prod
```

## API Reference

The interactive Swagger documentation is automatically generated and accessible when the application is running:

`http://localhost:8000/api/docs`

> **Note:** All API routes are prefixed with `/api/v1`.

## Project Structure

```text
src/
├── common/         # Global interceptors, guards, filters, pipes, and Swagger config
├── config/         # Centralized configuration management
├── modules/        # Domain-driven feature modules
│   ├── auth/       # Authentication and token issuance
│   ├── task/       # Core task domain
│   ├── account/    # User accounts and profiles
│   └── ...
├── utils/          # Shared utilities and helpers
├── main.ts         # Application bootstrap
└── app.module.ts   # Root dependency injection container
```

## Available Commands

- `npm run build` - Compile TypeScript to JavaScript.
- `npm run start:dev` - Start the development server with hot-reload.
- `npm run test` - Execute the Jest test suite.
- `npm run lint` - Run ESLint checks.
- `npm run format` - Apply Prettier formatting rules.

## License

[UNLICENSED](LICENSE)
