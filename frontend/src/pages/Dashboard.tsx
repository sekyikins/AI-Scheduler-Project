import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  PlayArrow,
  PriorityHigh,
  CalendarToday,
  Timer,
  Notifications,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { TaskCreate } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { tasks, createTask } = useTasks();
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TaskCreate>>({
    title: '',
    description: '',
    priority: 'medium',
  });

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress' || task.status === 'paused');
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && task.status !== 'completed');
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  );

  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const productivityScore = Math.round((completedTasks.length / Math.max(tasks.length, 1)) * 100);

  const handleCreateTask = async () => {
    if (newTask.title) {
      try {
        await createTask(newTask as TaskCreate);
        setNewTask({ title: '', description: '', priority: 'medium' });
        setOpenDialog(false);
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    }
  };



  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <PriorityHigh />;
      case 'medium': return <TrendingFlat />;
      case 'low': return <TrendingDown />;
      default: return <TrendingFlat />;
    }
  };

  const formatDate = (date: Date) => {
    const day = new Date(date).getDate();
    const month = new Date(date).toLocaleDateString('en-US', { month: 'long' });
    const year = new Date(date).getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string; subtitle?: string; onClick?: () => void }> = ({
    title, value, icon, color, subtitle, onClick
  }) => (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative', 
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography color="textSecondary" gutterBottom variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}20`,
              color: color,
              width: { xs: 40, sm: 56 },
              height: { xs: 40, sm: 56 },
              ml: 1,
            }}
          >
            {React.cloneElement(icon as React.ReactElement, { 
              sx: { fontSize: { xs: 20, sm: 28 } } 
            })}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Welcome Header with Quick Actions */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        justifyContent: 'space-between',
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Here's what's happening with your tasks today
          </Typography>
        </Box>
        
        {/* Quick Actions Icons */}
        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
          <Tooltip title="Add task">
          <IconButton
            color="primary"
            size={isSmallScreen ? 'medium' : 'large'}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <Add />
          </IconButton>
          </Tooltip>
          <Tooltip title="Start pomodoro">
          <IconButton
            color="warning"
            size={isSmallScreen ? 'medium' : 'large'}
            sx={{
              bgcolor: theme.palette.warning.main,
              color: theme.palette.warning.contrastText,
              '&:hover': {
                bgcolor: theme.palette.warning.dark,
              },
            }}
          >
            <Timer />
          </IconButton>
          </Tooltip>
          <Tooltip title="Open calendar">
          <IconButton
            color="info"
            size={isSmallScreen ? 'medium' : 'large'}
            sx={{
              bgcolor: theme.palette.info.main,
              color: theme.palette.info.contrastText,
              '&:hover': {
                bgcolor: theme.palette.info.dark,
              },
            }}
          >
            <CalendarToday />
          </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={tasks.length}
            icon={<Assignment />}
            color={theme.palette.primary.main}
            subtitle="All time"
            onClick={() => navigate('/tasks')}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={inProgressTasks.length}
            icon={<PlayArrow />}
            color={theme.palette.warning.main}
            subtitle="Currently working"
            onClick={() => navigate('/tasks?tab=2')}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={completedTasks.length}
            icon={<CheckCircle />}
            color={theme.palette.success.main}
            subtitle="Great job!"
            onClick={() => navigate('/tasks?tab=3')}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={overdueTasks.length}
            icon={<Notifications />}
            color={theme.palette.error.main}
            subtitle="Needs attention"
            onClick={() => navigate('/tasks?tab=4')}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {/* Progress and Tasks */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {/* Progress Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
              Task Completion Progress
            </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Overall productivity score: {productivityScore}%
                      </Typography>
                    </Box>
                  </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        Completion Rate
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {completionRate.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: theme.palette.grey[200],
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${completionRate}%`,
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: 6,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Box>
              </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Assignment />}
                      label={`${pendingTasks.length} Pending`}
                      color="default"
                      variant="outlined"
                    />
                    <Chip
                      icon={<PlayArrow />}
                      label={`${inProgressTasks.length} In Progress`}
                      color="warning"
                      variant="outlined"
                    />
                    <Chip
                      icon={<CheckCircle />}
                      label={`${completedTasks.length} Completed`}
                      color="success"
                      variant="outlined"
              />
            </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* High Priority Tasks */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 2 }}>
                      <PriorityHigh />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
              High Priority Tasks
            </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {highPriorityTasks.length} tasks need immediate attention
                      </Typography>
                    </Box>
                  </Box>

            <List>
              {highPriorityTasks.slice(0, 5).map((task) => (
                <ListItem
                  key={task.id}
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          mb: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                  secondaryAction={
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" color="primary">
                        <PlayArrow />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                          <Assignment color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={task.priority} 
                          size="small" 
                                color="error"
                                icon={getPriorityIcon(task.priority)}
                        />
                        {task.dueDate && (
                                <Chip
                                  icon={<CalendarToday fontSize="small" />}
                                  label={formatDate(task.dueDate)}
                                  size="small"
                                  variant="outlined"
                                />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {highPriorityTasks.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No high priority tasks"
                    secondary="Great job! All tasks are under control."
                  />
                </ListItem>
              )}
            </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Calendar Integration and Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* Calendar Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                      <CalendarToday />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Calendar View
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Task scheduling and deadlines
            </Typography>
                    </Box>
            </Box>

                  <Paper sx={{ p: 1.5, mb: 1.5 }}>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      This feature will include:
                    </Typography>
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CalendarToday fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Monthly and weekly calendar views" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Assignment fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Task scheduling and deadline visualization" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Schedule fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Google Calendar integration" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Drag and drop task management" />
                      </ListItem>
                    </List>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Activity
            </Typography>
            <List dense>
              {tasks.slice(0, 3).map((task) => (
                      <ListItem key={task.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                          {task.status === 'completed' ? (
                            <CheckCircle color="success" />
                          ) : task.status === 'in_progress' ? (
                            <PlayArrow color="warning" />
                          ) : (
                            <Assignment />
                          )}
                  </ListItemIcon>
                  <ListItemText
                    primary={task.title}
                    secondary={`${task.status} • ${formatDate(task.createdAt)}`}
                  />
                </ListItem>
              ))}
            </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Add Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={newTask.priority}
              label="Priority"
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained" disabled={!newTask.title}>
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 