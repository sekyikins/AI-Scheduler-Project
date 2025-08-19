import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  ListItem,
  ListItemIcon,
  IconButton,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  useTheme,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Notifications,
  CheckCircle,
  Warning,
  Info,
  Error,
  Delete,
  MarkEmailRead,
  Refresh,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationsContext';
import { Notification as CustomNotification } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const NotificationsPage: React.FC = () => {
  const theme = useTheme();
  const { notifications, loading, error, markAsRead, markAllAsRead, deleteNotification, loadNotifications } = useNotifications();
  const [tabValue, setTabValue] = useState(0);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReload = async () => {
    try {
      await loadNotifications();
    } catch (error) {
      // noop; loadNotifications already handles errors
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      case 'info':
      default:
        return <Info color="info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
      default:
        return theme.palette.info.main;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}min ago`;
    if (hours < 24) return `${hours}hr ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 4) return `${weeks}wk ago`;
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}yr ago`;
  };

  const filteredNotifications = () => {
    switch (tabValue) {
      case 0: return notifications; // All
      case 1: return notifications.filter(n => !n.read); // Unread
      case 2: return notifications.filter(n => n.read); // Read
      default: return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 0 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 0, pt: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="notification tabs">
            <Tab label={`All (${notifications.length})`} />
            <Tab label={`Unread (${unreadCount})`} />
            <Tab label={`Read (${readCount})`} />
          </Tabs>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {unreadCount > 0 && (
              <Tooltip title="Mark all as read">
                <Button
                  variant="outlined"
                  startIcon={<MarkEmailRead />}
                  onClick={handleMarkAllAsRead}
                  size="small"
                >
                  Mark All Read
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Reload notifications">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReload}
                size="small"
              >
                Reload
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Notifications List */}
      <TabPanel value={tabValue} index={0}>
        <NotificationsList 
          notifications={filteredNotifications()}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
          formatTime={formatTime}
          theme={theme}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <NotificationsList 
          notifications={filteredNotifications()}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
          formatTime={formatTime}
          theme={theme}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <NotificationsList 
          notifications={filteredNotifications()}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
          formatTime={formatTime}
          theme={theme}
        />
      </TabPanel>

      {filteredNotifications().length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {tabValue === 0 
                ? "You're all caught up!" 
                : tabValue === 1 
                  ? "No unread notifications" 
                  : "No read notifications"
              }
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

interface NotificationsListProps {
  notifications: CustomNotification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getNotificationIcon: (type: string) => React.ReactNode;
  getNotificationColor: (type: string) => string;
  formatTime: (date: Date) => string;
  theme: any;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getNotificationColor,
  formatTime,
  theme,
}) => (
  <Box sx={{ 
    display: 'grid', 
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 2,
    alignItems: 'start'
  }}>
    {notifications.map((notification, index) => (
      <Box key={notification.id}>
        <ListItem
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            mb: 2,
            backgroundColor: notification.read ? 'transparent' : 'action.hover',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            height: 160,
            display: 'flex',
            alignItems: 'stretch',
            gap: 2,
            p: 3,
          }}
        >
          {/* Left side: Color indicator */}
          <ListItemIcon sx={{ minWidth: 48, display: 'flex', alignItems: 'flex-start' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: getNotificationColor(notification.type),
              }}
            >
              {getNotificationIcon(notification.type)}
            </Avatar>
          </ListItemIcon>

          {/* Middle: Content container */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="h6"
                fontWeight={notification.read ? 400 : 600}
                sx={{ lineHeight: 1.2 }}
              >
                {notification.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ 
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {notification.message}
              </Typography>
            </Box>
            
            {/* Tips/info always at bottom */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 'auto' }}>
              <Chip
                label={notification.type}
                size="small"
                color={notification.type as any}
                variant="outlined"
              />
              {notification.taskId && (
                <Chip
                  label="Task Related"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Right side: Time and actions container */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, minWidth: 'fit-content' }}>
            <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'right', width: '100%', mr: 1 }}>
              {formatTime(notification.createdAt)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              {!notification.read && (
                <Tooltip title="Mark as read">
                  <IconButton
                    size="small"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <MarkEmailRead fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Delete notification">
                <IconButton
                  size="small"
                  onClick={() => onDelete(notification.id)}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </ListItem>
      </Box>
    ))}
  </Box>
);

export default NotificationsPage; 