# Overview

Yappyy is a world-class AI-powered public speaking improvement platform built with React, TypeScript, and Express.js. Its core purpose is to provide advanced, real-time feedback on speaking performance, body language, and content quality. Key capabilities include multi-modal AI analytics, real-time computer vision, precise eye tracking, and comprehensive gamification. Yappyy aims to deliver professional-grade feedback and personalized coaching for various speaking scenarios, from business presentations to competitive events. The platform now features breakthrough authentic data availability, eliminating fake metrics and relying on robust computer vision and audio analysis.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom branding
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Features**: Custom hooks for speech recognition, voice analysis, and MediaPipe integration
- **Design Decisions**: Poppins font implemented throughout for professional typography; moving gradient background for hero section; professional card designs for various components.

## Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM, hosted on Neon serverless
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Multi-tier system including Google OAuth (primary), Replit Auth, Magic Link Auth, and Demo Auth. Anyone with a Google account can sign in.
- **Payload Limits**: Increased Express.js payload limit to 50mb for session saving and PDF export.

## Key Technical Implementations & Features
- **AI Integration**:
    - **Multi-Modal AI**: OpenAI GPT-4o and Anthropic Claude 3.5 Sonnet for diverse coaching.
    - **Personalized AI Coach**: True neural network architecture with multi-layer perceptron, self-learning feedback system, and individual user neural profiles. Continuously learns user preferences and adapts coaching style.
    - **Purpose-Driven Content Analysis**: Context-aware analysis providing purpose-specific feedback (e.g., sales, job interviews).
    - **Advanced Content Analysis Engine**: Uses NLP libraries (Compromise.js, Natural.js, Sentiment.js, Franc) for persuasiveness, clarity, structure, and engagement analysis.
- **Computer Vision**:
    - **Comprehensive Multi-Engine CV Stack**: Integrated Google Cloud Vision API, MediaPipe Holistic, and OpenPose framework for advanced gesture and body language analysis.
    - **Enhanced Computer Vision Integration**: ComprehensiveVisionDashboard with real-time multi-system analysis combining Google Cloud Vision, MediaPipe, and OpenPose engines.
    - **100% Authentic Data Policy**: All metrics derived exclusively from real mathematical image analysis, computer vision, and voice analysis; zero placeholder or fallback values policy enforced throughout the system.
    - **Advanced Gesture Recognition**: Multi-engine hand gesture analysis with confidence scoring and landmark detection.
    - **Professional Posture Analysis**: Real-time posture scoring with multiple detection algorithms and fallback systems.
    - **Facial Analysis**: Advanced emotion detection, eye contact measurement, and engagement scoring using multiple CV engines.
- **Speech & Voice Analytics**:
    - **Free Voice Analysis Stack**: Uses NLP.js, HuggingFace Transformers, and SpeechBrain for sentiment analysis and emotion recognition.
    - **Advanced Speech Analytics Engine**: Built with Web Audio API for filler word detection, sentiment analysis, voice quality metrics (pitch, clarity, pacing), and pronunciation assessment.
    - **Advanced Vocal Filler Detection**: Captures raw audio for backend processing of "um" and "uh" patterns.
- **Real-time Processing**:
    - **Redis + Socket.IO**: For sub-second feedback delivery and real-time session management.
    - **Bull Queue**: For background AI processing and job scheduling.
    - **WebRTC capabilities**: For ultra-low latency potential.
- **Practice System**:
    - **Real-time Feedback**: Enhanced L.V.I.E. system with MediaPipe and TensorFlow.js integration.
    - **Session Recording**: Audio/video capture with synchronized AI analytics and emotion tracking.
    - **Video Recording & Playback**: High-quality video recording system with MediaRecorder API and a professional playback interface.
    - **Automatic Session Saving**: Sessions save to the database when recording stops, with comprehensive analysis available.
- **Sequential Session Numbering**: Robust system ensures session numbers increment forever (1, 2, 3... ∞) with collision prevention and fallback protection.
- **Content Management**:
    - **Template System**: Expanded library of 50+ pre-built templates for various speaking scenarios with AI personalization.
    - **PDF Export System**: Enhanced session analysis and template PDFs with modern styling and accurate data.
- **User Experience**:
    - **Daily Goals Tracker**: Integrated into the Progress tab for interactive goal management.
    - **Welcome Back Experience**: Enhanced detection for new vs. returning users, providing personalized welcome and daily goals.
    - **Transcript Tab**: Enhanced with video rewatch feature synchronized with transcript.
    - **Branding**: Clean "Yappyy" text branding with a clickable Y logo.

## System Design Choices
- **Zero Runtime Errors Policy**: Robust computer vision system and server-side error handling ensure stability.
- **Authentic Data Focus**: Eliminated all Math.random() and placeholder values, ensuring all metrics are derived from real analysis.
- **Graceful Degradation**: System maintains stability when external APIs are unavailable.
- **Modular Architecture**: Clear separation of concerns between frontend and backend, with dedicated modules for AI, computer vision, and speech analytics.
- **Scalable Infrastructure**: Designed for enterprise-grade performance with caching and queue processing.

# External Dependencies

- **AI Services**:
    - **OpenAI GPT-4o**: Primary AI coaching engine.
    - **Anthropic Claude 3.5 Sonnet**: Secondary AI for diverse coaching.
- **Computer Vision Libraries/APIs**:
    - **MediaPipe Holistic**: Google's framework for comprehensive body language analysis.
    - **TensorFlow.js**: For custom emotion detection and gesture recognition models.
    - **Face-api.js**: For advanced facial expression and micro-expression analysis.
    - **WebGazer.js**: For professional-grade eye tracking.
    - **OpenCV.js**: For advanced gesture recognition.
    - **Roboflow**: For real-time pose detection and gesture recognition.
- **Speech Processing Libraries**:
    - **Compromise.js**: For NLP tasks in content analysis.
    - **Natural.js**: For NLP tasks in content analysis.
    - **Sentiment.js**: For sentiment analysis in content analysis.
    - **Franc**: For language detection.
    - **NLP.js**: For sentiment analysis in free voice analysis.
    - **HuggingFace Transformers**: For emotion recognition from speech.
    - **SpeechBrain**: For emotion recognition from speech.
- **Database & Real-time Infrastructure**:
    - **PostgreSQL**: Primary database.
    - **Neon**: Serverless PostgreSQL provider.
    - **Redis**: For high-performance real-time session management and caching.
    - **ioredis**: Redis client for Node.js.
    - **Socket.IO**: For real-time bidirectional communication.
    - **Bull Queue**: For background job processing.
- **Authentication**:
    - **Google OAuth**: For user authentication.
    - **Replit Auth**: For Replit user authentication.
- **Frontend Libraries**:
    - **React Query (TanStack Query v5)**: For advanced server state management.
    - **Framer Motion**: For smooth animations.
    - **Radix UI**: For accessible component systems.
    - **shadcn/ui**: Component library built on Radix UI.
    - **Tailwind CSS**: Utility-first styling.
    - **Lucide React**: Icon system.
    - **Wouter**: Lightweight client-side router.
- **Deployment**:
    - **Vite**: Frontend build tool.
    - **esbuild**: Server compilation.