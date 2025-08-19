import React from 'react';
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Notifications,
  CheckCircle,
  Close,
  Assignment,
  Timer,
  CalendarToday,
  PriorityHigh,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationsContext';

interface NotificationsPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  anchorEl,
  onClose,
}) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const theme = useTheme();

  // Filter to show only unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task': return <Assignment />;
      case 'pomodoro': return <Timer />;
      case 'calendar': return <CalendarToday />;
      case 'priority': return <PriorityHigh />;
      default: return <Notifications />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task': return theme.palette.primary.main;
      case 'pomodoro': return theme.palette.warning.main;
      case 'calendar': return theme.palette.info.main;
      case 'priority': return theme.palette.error.main;
      default: return theme.palette.grey[500];
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

  const unreadCount = unreadNotifications.length;



  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: 500,
          mt: 1,
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Close">
              <IconButton size="small" onClick={onClose}>
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {unreadCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              color="primary"
            />
            <Tooltip title="Mark all as read">
              <Button
                size="small"
                variant="outlined"
                onClick={handleMarkAllAsRead}
                sx={{ fontSize: '0.75rem' }}
              >
                Mark all read
              </Button>
            </Tooltip>
          </Box>
        )}
      </Box>

      <List sx={{ p: 0 }}>
        {unreadNotifications.slice(0, 5).map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              '&:last-child': {
                borderBottom: 'none',
              },
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: getNotificationColor(notification.type),
                }}
              >
                {getNotificationIcon(notification.type)}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="body1" fontWeight={600} sx={{ flex: 1 }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ ml: 2, flexShrink: 0 }}>
                    {formatTime(notification.createdAt)}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                  {notification.message}
                </Typography>
              }
            />
            <Tooltip title="Mark as read">
              <IconButton
                size="small"
                onClick={() => handleMarkAsRead(notification.id)}
                sx={{ ml: 1 }}
                color="primary"
                title="Mark as read"
              >
                <CheckCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
        {unreadNotifications.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No unread notifications"
              secondary="You're all caught up!"
            />
          </ListItem>
        )}
        {unreadNotifications.length > 5 && (
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{ mt: 1 }}
            >
              View All Notifications
            </Button>
          </ListItem>
        )}
      </List>
    </Popover>
  );
};

export default NotificationsPopover; 