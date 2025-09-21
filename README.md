# MinimalAuth Website

## Overview

MinimalAuth is an informational showcase website that presents a privacy-focused philosophy and suite of applications. The site introduces the MinimalAuth principle of authentication using only username, password, and recovery key - no email or phone number required. The website serves as a landing page to showcase various privacy-focused applications in the MinimalAuth suite, including LinkBoard, NoteVault, TaskFlow, and ForumLite.

This is a full-stack web application built with React (frontend) and Express.js (backend), featuring an admin panel for managing the displayed applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: Express sessions for admin authentication
- **API Design**: RESTful API endpoints with JSON responses
- **Data Storage**: In-memory storage with fallback to PostgreSQL for production

### Database Schema
- **Users Table**: Basic user structure (currently unused for public users)
- **Apps Table**: Stores application information including name, description, URL, icon, and gradient styling
- **Session Storage**: Express sessions for admin authentication state

### Authentication System
- **Admin Authentication**: Simple username/password system (admin/251991)
- **Session Management**: Server-side sessions with configurable expiration
- **No Public Authentication**: Website is purely informational - no user registration/login

### Component Architecture
- **Atomic Design**: Reusable UI components in `/components/ui/`
- **Page Components**: Main page components in `/pages/`
- **Shared Components**: Business logic components like AppCard, Header, Footer
- **Layout System**: Responsive design with mobile-first approach

### Data Flow
- **Server-Side Rendering**: Vite handles SSR in development
- **API Communication**: TanStack Query manages server state and caching
- **Real-time Updates**: Optimistic updates for admin operations
- **Error Handling**: Centralized error handling with toast notifications

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Drizzle Kit**: Database migrations and schema management

### UI Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Class Variance Authority**: Component variant management

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite Plugins**: Runtime error overlay, development banner, and cartographer for Replit integration
- **ESBuild**: Fast bundling for production builds

### Deployment & Infrastructure
- **Replit Integration**: Specialized Vite plugins for Replit development environment
- **Environment Variables**: Database URL and session secrets configuration
- **Static Asset Serving**: Express serves built frontend assets in production

### Form & Validation
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with validation integration
- **Drizzle Zod**: Auto-generated Zod schemas from database schema