import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  Timer,
  Settings,
  AccountCircle,
  Notifications,
  Logout,
  DarkMode,
  LightMode,
  SmartToy,
  ChevronLeft,
  ChevronRight,
  Edit,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationsContext';
import NotificationsPopover from './NotificationsPopover';

const drawerWidth = 250;
const collapsedDrawerWidth = 75;

const menuItems = [
  { text: 'Assistant', icon: <SmartToy />, path: '/assistant', motto: 'Your intelligent task management companion' },
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Tasks', icon: <Assignment />, path: '/tasks' },
  { text: 'Pomodoro', icon: <Timer />, path: '/pomodoro' },
  { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useCustomTheme();
  const { unreadCount } = useNotifications();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Responsive drawer width
  const currentDrawerWidth = isSmallScreen ? 240 : sidebarCollapsed ? collapsedDrawerWidth : drawerWidth;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUserInfoClick = () => {
    navigate('/settings?edit=profile');
    setMobileOpen(false);
  };

  const currentMenuItem = menuItems.find(item => item.path === location.pathname) || menuItems[1]; // Default to Dashboard

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: sidebarCollapsed ? 2 : 1, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
      }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            mr: sidebarCollapsed ? 0 : 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="sidebarGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1976d2" stopOpacity="1" />
                  <stop offset="100%" stopColor="#42a5f5" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="sidebarGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4caf50" stopOpacity="1" />
                  <stop offset="100%" stopColor="#66bb6a" stopOpacity="1" />
                </linearGradient>
              </defs>
              
              {/* Background circle */}
              <circle cx="16" cy="16" r="15" fill="url(#sidebarGrad1)" stroke="#1565c0" strokeWidth="1"/>
              
              {/* Brain/Neural network representation */}
              <g fill="white" opacity="0.9">
                {/* Main brain shape */}
                <path d="M12 10 Q16 8 20 10 Q22 12 22 14 Q22 16 20 18 Q16 20 12 18 Q10 16 10 14 Q10 12 12 10 Z"/>
                
                {/* Neural connections */}
                <circle cx="14" cy="12" r="1"/>
                <circle cx="18" cy="12" r="1"/>
                <circle cx="16" cy="14" r="1"/>
                <circle cx="13" cy="16" r="1"/>
                <circle cx="19" cy="16" r="1"/>
                
                {/* Connection lines */}
                <line x1="14" y1="12" x2="16" y2="14" stroke="white" strokeWidth="0.5"/>
                <line x1="18" y1="12" x2="16" y2="14" stroke="white" strokeWidth="0.5"/>
                <line x1="16" y1="14" x2="13" y2="16" stroke="white" strokeWidth="0.5"/>
                <line x1="16" y1="14" x2="19" y2="16" stroke="white" strokeWidth="0.5"/>
              </g>
              
              {/* Task checklist */}
              <g fill="url(#sidebarGrad2)">
                {/* Checklist background */}
                <rect x="8" y="22" width="16" height="8" rx="2" fill="white" opacity="0.95"/>
                <rect x="8.5" y="22.5" width="15" height="7" rx="1.5" fill="url(#sidebarGrad2)"/>
                
                {/* Checkmark */}
                <path d="M11 25 L13 27 L17 23" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* Task line */}
                <rect x="19" y="25" width="4" height="1" rx="0.5" fill="white"/>
              </g>
              
              {/* AI indicator */}
              <circle cx="24" cy="8" r="3" fill="#ff9800" opacity="0.9"/>
              <text x="24" y="10" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">AI</text>
            </svg>
          </Box>
          {!sidebarCollapsed && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: theme.palette.primary.main, mb: 0 }}>
                AI Scheduler
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Smart Task Management
              </Typography>
            </Box>
          )}
        </Box>

      <Box sx={{ flex: 1, py: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5, mx: sidebarCollapsed ? 0.5 : 0.5 }}>
              <Tooltip title={sidebarCollapsed ? item.text : ''} placement="right">
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    mx: sidebarCollapsed ? 0.5 : 1.5,
                    width: sidebarCollapsed ? 'auto' : 'calc(100% - 32px)',
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.contrastText,
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: sidebarCollapsed ? 0 : 40,
                    display: 'flex',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!sidebarCollapsed && (
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        fontSize: '0.875rem',
                        noWrap: true,
                      }}
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        maxWidth: '70%',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Tooltip title={sidebarCollapsed ? `${user?.name || 'User'}` : ''} placement="right">
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={handleUserInfoClick}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: sidebarCollapsed ? 0 : 2,
                bgcolor: theme.palette.secondary.main,
              }}
            >
              {user?.name?.charAt(0) || <AccountCircle />}
            </Avatar>
            {!sidebarCollapsed && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.email}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { 
            xs: '100%',
            sm: `calc(100% - ${currentDrawerWidth}px)` 
          },
          ml: { 
            xs: 0,
            sm: `${currentDrawerWidth}px` 
          },
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'linear-gradient(90deg, rgba(99,102,241,0.08), rgba(245,158,11,0.08))',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          height: { xs: 56, sm: 64 },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: '100%', minHeight: { xs: '56px !important', sm: '64px !important' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
            <Tooltip title="Toggle sidebar">
              <IconButton color="inherit" onClick={handleSidebarToggle} sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}>
                {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
            </Tooltip>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, minWidth: 0 }}>
              {React.cloneElement(currentMenuItem.icon, { 
                sx: { fontSize: { xs: 24, sm: 28 }, mr: 1, color: theme.palette.primary.main } 
              })}
              <Typography 
                variant="h5" 
                fontWeight={700}
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: { xs: '1.1rem', sm: '1.5rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {currentMenuItem.text}
              </Typography>
            </Box>
            {currentMenuItem.motto && !isSmallScreen && (
              <Typography 
                variant="body2" 
                color="textSecondary"
                sx={{ 
                  borderLeft: `2px solid ${theme.palette.divider}`,
                  pl: 2,
                  ml: 2,
                  fontStyle: 'italic',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                {currentMenuItem.motto}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <Tooltip title="Toggle theme">
              <IconButton color="inherit" onClick={toggleTheme} size={isSmallScreen ? 'small' : 'medium'}>
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationsClick} size={isSmallScreen ? 'small' : 'medium'}>
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          
            <Tooltip title="Account">
              <IconButton
                size={isSmallScreen ? 'small' : 'large'}
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}>
                  {user?.name?.charAt(0) || <AccountCircle />}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: isSmallScreen ? 240 : drawerWidth,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: currentDrawerWidth,
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'linear-gradient(180deg, rgba(99,102,241,0.06), rgba(245,158,11,0.06))',
              borderRight: `1px solid ${theme.palette.divider}`,
              transition: 'width 0.2s ease-in-out',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2 },
          width: { 
            xs: '100%',
            sm: `calc(100% - ${currentDrawerWidth}px)` 
          },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ height: { xs: 58, sm: 66 } }} />
        <Outlet />
      </Box>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => navigate('/settings?edit=profile')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <NotificationsPopover
        anchorEl={notificationsAnchorEl}
        onClose={handleNotificationsClose}
      />
    </Box>
  );
};

export default Layout;