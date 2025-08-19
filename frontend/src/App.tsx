import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import Tasks from './pages/Tasks';
import Pomodoro from './pages/Pomodoro';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import NotificationsPage from './pages/Notifications';

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <NotificationsProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="assistant" element={<Assistant />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="pomodoro" element={<Pomodoro />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </NotificationsProvider>
        </TaskProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App; 