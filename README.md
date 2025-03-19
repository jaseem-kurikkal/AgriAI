# AgriAI - Agricultural AI Assistant Platform

## Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Application pages
├── server/              # Backend Express server
│   ├── routes.ts       # API routes
│   └── index.ts        # Server entry point
└── shared/             # Shared code between client and server
```

## Prerequisites
- Node.js 20 or later
- npm (comes with Node.js)

## Installation

1. Clone or download the repository
2. Install dependencies:
```bash
npm install
```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start:
- Frontend development server
- Backend API server
Both will be served on port 5000.

Visit `http://localhost:5000` to view the application.

## Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Features
- Authentication system with login/register functionality
- Interactive dashboard
- Plant disease detection module (in development)
- Seed recommendation system (in development)
- Seasonal crop planning (in development)
- Agricultural news feed (in development)
- AI-powered farming assistant (in development)

## Environment Setup
The application will work out of the box for development. For production deployment, you'll need:

1. A PostgreSQL database (if using database features)
2. Environment variables:
   - `DATABASE_URL` (if using database)
   - `SESSION_SECRET` (for authentication)

## Tech Stack
- Frontend: React, Typescript, TailwindCSS, shadcn/ui
- Backend: Express.js, Node.js
- Authentication: Passport.js
- State Management: TanStack Query
- Routing: Wouter
