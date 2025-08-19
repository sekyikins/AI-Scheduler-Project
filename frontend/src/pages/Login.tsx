import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd,
  AutoAwesome,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const theme = useTheme();
  const { mode, toggleTheme } = useCustomTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('password');
    setIsRegistering(false);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
              <Button onClick={toggleTheme} size="small" startIcon={mode === 'dark' ? <LightMode /> : <DarkMode /> }>
                {mode === 'dark' ? 'Light' : 'Dark'}
              </Button>
            </Box>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                mx: 'auto',
                mb: 2,
              }}
            >
              {/* Use default app icon */}
              <img src="/favicon.svg" alt="App" style={{ width: 40, height: 40 }} />
            </Avatar>
            <Typography component="h1" variant="h3" fontWeight={700} gutterBottom>
            AI Task Scheduler
          </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {isRegistering ? 'Create your account' : 'Welcome back'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {isRegistering 
                ? 'Start organizing your tasks with AI assistance'
                : 'Sign in to continue to your dashboard'
              }
            </Typography>
          </Box>

          {/* Demo Credentials Card */}
          <Card sx={{ width: '100%', mb: 3, bgcolor: 'primary.50', border: `1px solid ${theme.palette.primary.light}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutoAwesome color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary" fontWeight={600}>
                  🎯 Demo Mode
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Use these credentials to explore the app with mock data:
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                  <strong>Email:</strong> demo@example.com
                </Typography>
                <Typography variant="body2" component="div">
                  <strong>Password:</strong> password
          </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={handleDemoLogin}
                sx={{ mt: 2 }}
                startIcon={<AutoAwesome />}
              >
                Use Demo Credentials
              </Button>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {isRegistering && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={isRegistering ? <PersonAdd /> : <LoginIcon />}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {loading 
                ? 'Please wait...' 
                : isRegistering 
                  ? 'Create Account' 
                  : 'Sign In'
              }
            </Button>
          </Box>

          {/* Toggle Mode */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
            </Divider>
            
            <Button
              variant="text"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
              sx={{ textTransform: 'none' }}
              >
                {isRegistering
                  ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 