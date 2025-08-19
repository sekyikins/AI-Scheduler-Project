import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Notifications,
  Timer,
  CalendarToday,
  Security,
  Palette,
  Edit,
  Delete,
  AccountCircle,
  Email,
  Person,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const location = useLocation();
  const [notifications, setNotifications] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Check if we should open edit profile dialog from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'profile') {
      setEditProfileOpen(true);
    }
  }, [location.search]);

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      setDeleteError('Password is required');
      return;
    }

    try {
      // Here you would call the actual delete account API
      // For now, we'll just simulate it
      console.log('Deleting account with password:', password);
      await logout();
    } catch (error) {
      setDeleteError('Failed to delete account. Please try again.');
    }
  };

  const handleEditProfile = async () => {
    try {
      // Here you would call the actual update profile API
      console.log('Updating profile:', editForm);
      setEditProfileOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Box>
      {/* Account Information */}
      <Paper sx={{ p: 3, mb: 2, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: theme.palette.primary.main,
              mr: 2,
            }}
          >
            {user?.name?.charAt(0) || <AccountCircle />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              Account Information
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage your account details and preferences
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditProfileOpen(true)}
          >
            Edit Profile
          </Button>
        </Box>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText
              primary="Name"
              secondary={user?.name || 'Not set'}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText
              primary="Email"
              secondary={user?.email || 'Not set'}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Notifications */}
      <Paper sx={{ p: 3, mb: 2, pb: 0 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Notifications
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive email notifications for task deadlines"
            />
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Timer />
            </ListItemIcon>
            <ListItemText
              primary="Pomodoro Reminders"
              secondary="Get notified when Pomodoro sessions end"
            />
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Appearance */}
      <Paper sx={{ p: 3, mb: 2, pb: 0 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Appearance
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Palette />
            </ListItemIcon>
            <ListItemText
              primary="Dark Mode"
              secondary="Switch to dark theme"
            />
            <Switch
              checked={mode === 'dark'}
              onChange={toggleTheme}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Integrations */}
      <Paper sx={{ p: 3, mb: 2, pb: 0 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Integrations
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText
              primary="Google Calendar"
              secondary="Sync tasks with Google Calendar"
            />
            <Button variant="outlined" size="small">
              Connect
            </Button>
          </ListItem>
        </List>
      </Paper>

      {/* Account Actions */}
      <Paper sx={{ p: 3, pb: 0 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Account Actions
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Security />
            </ListItemIcon>
            <ListItemText
              primary="Change Password"
              secondary="Update your account password"
            />
            <Button variant="outlined" size="small">
              Change
            </Button>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <Logout color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              secondary="Log out of your account"
            />
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={logout}
            >
              Sign Out
            </Button>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <Delete color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Delete Account"
              secondary="Permanently delete your account and all data"
            />
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </ListItem>
        </List>
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            To confirm account deletion, please enter your password:
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            error={!!deleteError}
            helperText={deleteError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={!password.trim()}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editProfileOpen} 
        onClose={() => setEditProfileOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={600}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            variant="outlined"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditProfile}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 