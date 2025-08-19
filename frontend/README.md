# AI Task Scheduler - Frontend

A modern React TypeScript frontend for the AI Task Scheduler application.

## Features

- **Task Management**: Create, edit, delete, and organize tasks with priority levels
- **Pomodoro Timer**: Built-in Pomodoro technique timer with work/break cycles
- **Dashboard**: Overview of tasks, progress, and quick actions
- **Responsive Design**: Works on desktop and mobile devices
- **Material-UI**: Modern, accessible UI components
- **Authentication**: User login and registration system

## Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API communication
- **React Context** for state management

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm lint` - Run ESLint
- `npm lint:fix` - Fix ESLint errors
- `npm format` - Format code with Prettier

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Authentication wrapper
├── contexts/           # React contexts for state management
│   ├── AuthContext.tsx # Authentication state
│   └── TaskContext.tsx # Task management state
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Tasks.tsx       # Task management
│   ├── Pomodoro.tsx    # Pomodoro timer
│   ├── Calendar.tsx    # Calendar view
│   ├── Settings.tsx    # User settings
│   └── Login.tsx       # Authentication
├── services/           # API services
│   └── api.ts          # API client and endpoints
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Features

### Task Management
- Create tasks with title, description, and priority
- Edit and delete existing tasks
- Mark tasks as completed
- Filter tasks by status (pending, in progress, completed, cancelled)
- Set due dates and track deadlines

### Pomodoro Timer
- 25-minute work sessions with 5-minute breaks
- Start, pause, and stop timer functionality
- Task association with Pomodoro sessions
- Session history tracking
- Visual progress indicator

### Dashboard
- Task statistics and progress overview
- Quick action buttons
- Recent activity feed
- High priority task highlights

### Authentication
- User registration and login
- Protected routes
- JWT token management
- User profile information

## API Integration

The frontend communicates with the backend API through the `api.ts` service file. All API calls are centralized and include:

- Authentication endpoints
- Task CRUD operations
- Pomodoro session management
- Calendar integration
- Notification system

## Development

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Material-UI design system

### State Management
- React Context for global state
- Local state for component-specific data
- API integration through custom hooks

### Responsive Design
- Mobile-first approach
- Material-UI responsive breakpoints
- Touch-friendly interface

## Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `build/` directory.

### Environment Variables
Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:8000
```

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is part of the AI Task Scheduler application. 