# Frontend Demo with Mock Data

This guide explains how to run the frontend application with mock data, allowing you to explore the UI without needing the backend.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🎯 Demo Mode

The frontend is configured to use **mock data** instead of real API calls. This means:

- ✅ **No backend required** - Everything works with dummy data
- ✅ **Full functionality** - All features are simulated
- ✅ **Realistic data** - Sample tasks, notifications, calendar events, etc.
- ✅ **Interactive** - You can create, edit, and delete items (changes are stored in memory)

## 🔐 Demo Login

Use these credentials to access the application:

- **Email:** `demo@example.com`
- **Password:** `password`

The login page will show these credentials automatically.

## 📊 Mock Data Included

The application includes realistic mock data for all features:

### Tasks
- 6 sample tasks with different priorities and statuses
- Tasks include descriptions, due dates, estimated durations
- Some tasks are marked as AI-generated

### Pomodoro Sessions
- 4 completed work and break sessions
- Session statistics and tracking

### Calendar Events
- 3 calendar events linked to tasks
- Events with descriptions and time ranges

### Notifications
- 4 notifications of different types (success, warning, info)
- Mix of read and unread notifications

### AI Features
- Mock AI responses for task suggestions
- Simulated AI processing delays

## 🎨 Features You Can Explore

### Dashboard
- Overview of tasks, productivity stats
- Recent activity and progress charts
- Quick actions and shortcuts

### Tasks Management
- View all tasks with filtering and sorting
- Create new tasks
- Edit existing tasks
- Change task status and priority
- Delete tasks

### Pomodoro Timer
- Start work sessions
- Take breaks
- View session history
- Track productivity stats

### Calendar
- View calendar events
- Create new events
- Edit existing events
- Sync with Google Calendar (simulated)

### Settings
- User profile management
- Application preferences
- Notification settings

## 🔧 How It Works

The mock system works by:

1. **Mock API Service** (`src/services/mockApi.ts`) - Simulates API responses
2. **Mock Data** (`src/services/mockData.ts`) - Provides realistic sample data
3. **API Interception** (`src/services/api.ts`) - Routes all API calls to mock services
4. **Context Updates** - Updated contexts work with mock response format

## 🎭 Simulated Features

### Network Delays
- API calls have realistic delays (300ms - 3s)
- Loading states and spinners work properly
- Error handling is simulated

### Data Persistence
- Changes are stored in memory during the session
- Refreshing the page resets to original mock data
- No permanent storage (as expected with mock data)

### Authentication
- Mock JWT token is stored in localStorage
- Login/logout functionality works
- Protected routes are enforced

## 🚨 Important Notes

1. **No Real Backend** - All data is simulated
2. **Session Only** - Changes are lost on page refresh
3. **Demo Purpose** - This is for UI/UX exploration only
4. **No External Services** - Google Calendar, email, etc. are simulated

## 🎯 Next Steps

Once you're satisfied with the frontend design and functionality:

1. **Connect to Real Backend** - Update `src/services/api.ts` to use real API calls
2. **Set Up Backend** - Follow the backend setup instructions
3. **Configure Environment** - Update environment variables for production

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 in use**
   ```bash
   # Use a different port
   PORT=3001 npm start
   ```

2. **Dependencies not installed**
   ```bash
   npm install
   ```

3. **TypeScript errors**
   ```bash
   npm run build
   ```

### Getting Help

- Check the browser console for errors
- Verify all dependencies are installed
- Ensure you're using the correct Node.js version

## 🎉 Enjoy Exploring!

The frontend is now ready for you to explore all the features with realistic mock data. You can:

- Test the user interface
- Explore different pages and features
- Understand the user flow
- Evaluate the design and functionality

Happy exploring! 🚀 