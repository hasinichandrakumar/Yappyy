# Overview

This is a comprehensive AI-powered public speaking improvement platform called "Yappyy" built with React, TypeScript, and Express.js. The platform provides real-time feedback on speaking performance, body language analysis, and personalized coaching for competitive events like DECA, FBLA, and HOSA. It features advanced AI coaching, badge systems, session tracking, and a 50+ template marketplace for various speaking scenarios.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom color palette matching brand identity
- **State Management**: React Query (TanStack Query) for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Features**: Custom hooks for speech recognition, voice analysis, and MediaPipe integration

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Dual system - Google OAuth for production, demo auth for development

## Key Components

### AI Integration
- **Primary AI**: OpenAI GPT-4o for comprehensive speech coaching and content analysis
- **Speech Recognition**: Web Speech API with custom hooks for real-time transcription
- **Computer Vision**: MediaPipe for body language and posture analysis
- **Voice Analysis**: Custom audio processing for clarity, pace, and volume metrics

### Practice System
- **Real-time Feedback**: L.V.I.E. (Live Vocal & Interaction Evaluation) system
- **Session Recording**: Audio/video capture with synchronized analytics
- **Progress Tracking**: Metrics for voice clarity, body language, content structure
- **Badge System**: Gamified achievements based on speaking performance

### Content Management
- **Template System**: 50+ pre-built templates for various speaking scenarios
- **AI Personalization**: Custom template adaptation based on user requests
- **Session Analysis**: Comprehensive post-session insights and recommendations

## Data Flow

1. **Session Creation**: User selects practice goal and session parameters
2. **Real-time Capture**: Audio/video streams processed for live metrics
3. **AI Analysis**: OpenAI processes transcript and metrics for coaching insights
4. **Data Storage**: Session data, metrics, and analysis stored in PostgreSQL
5. **Progress Tracking**: Historical data aggregated for long-term improvement insights

## External Dependencies

### AI Services
- **OpenAI API**: Primary AI coaching engine (GPT-4o model)
- **MediaPipe**: Google's framework for body language analysis
- **Web Speech API**: Browser-native speech recognition

### Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Google OAuth**: Production authentication system
- **Replit Platform**: Development and deployment environment

### Frontend Libraries
- **React Query**: Server state management and caching
- **Framer Motion**: Animation library for enhanced UX
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework

## Deployment Strategy

### Development Setup
- **Environment**: Replit-optimized with hot reload
- **Database**: Neon serverless with connection pooling
- **Build Process**: Vite handles frontend bundling, esbuild for server compilation
- **Session Storage**: PostgreSQL-backed sessions for persistence

### Production Considerations
- **Authentication**: Google OAuth with fallback to demo mode
- **Database**: Optimized connection pooling for serverless environment
- **Static Assets**: Served through Vite's build system
- **API Routes**: Express.js with comprehensive error handling

### Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials
- `SESSION_SECRET`: Session encryption key

The architecture emphasizes real-time performance analysis, AI-driven insights, and scalable data management while maintaining a smooth user experience across practice sessions and competitive event preparation.