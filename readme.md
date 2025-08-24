# Overview

InterviewAI is a comprehensive AI-powered mock interview platform that helps users practice and improve their interview skills. The application provides voice-enabled mock interviews with AI-generated questions tailored to specific job roles, experience levels, and tech stacks. Users receive detailed AI feedback and scoring on their performance, with comprehensive analytics and progress tracking through a modern dashboard interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built as a single-page application (SPA) using React with TypeScript and modern tooling:

- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with authentication-based route protection
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Build Tool**: Vite for fast development and optimized production builds
- **Authentication Flow**: Conditional routing based on authentication state, redirecting unauthenticated users to login

The frontend follows a component-based architecture with clear separation between pages, reusable UI components, and custom hooks for shared logic.

## Backend Architecture

The server-side uses a modern Node.js stack with Express and PostgreSQL:

- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Database**: PostgreSQL with Neon serverless hosting for scalable data storage
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Authentication**: OpenID Connect integration with Replit for secure user authentication
- **Session Management**: Express sessions with PostgreSQL session store for persistent user sessions

The backend follows a layered architecture with separate modules for routing, database operations, and external service integrations.

## Database Design

The application uses PostgreSQL with a normalized schema supporting:

- **User Management**: User profiles with preferences for interview customization
- **Interview System**: Interview records with associated questions and responses
- **Session Storage**: Secure session management with automatic cleanup
- **Analytics**: Performance tracking and progress metrics

The schema uses Drizzle ORM with TypeScript for compile-time type safety and includes proper indexing for performance optimization.

## AI Integration

The platform integrates Google Gemini AI for intelligent interview functionality:

- **Question Generation**: Dynamic creation of technical, behavioral, and situational questions based on job role and experience level
- **Response Evaluation**: AI-powered scoring and feedback on user responses including technical accuracy, communication skills, and confidence assessment
- **Personalization**: Tailored question difficulty and focus areas based on user preferences and tech stack

## Real-time Features

LiveKit integration provides voice-enabled interview capabilities:

- **Voice Processing**: Real-time audio capture and transcription for natural interview conversations
- **Room Management**: Secure interview rooms with participant access control
- **Audio Quality**: Professional-grade audio processing for clear communication

# External Dependencies

## AI Services
- **Google Gemini API**: Powers intelligent question generation and response evaluation with natural language processing

## Database & Hosting
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling and backup management
- **Replit Hosting**: Development and deployment platform with integrated authentication

## Voice & Communication
- **LiveKit**: Real-time voice communication infrastructure for interview sessions with WebRTC support

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **Radix UI**: Accessible component primitives for robust user interface elements
- **shadcn/ui**: Pre-built component library combining Radix UI with Tailwind CSS styling

## Development Tools
- **Vite**: Modern build tool for fast development and optimized production builds
- **TypeScript**: Static type checking for improved code quality and developer experience
- **Drizzle Kit**: Database migration and schema management tools