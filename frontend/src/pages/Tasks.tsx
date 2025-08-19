import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Checkbox,
  Chip,
  IconButton,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Delete,
  Assignment,
  PlayArrow,
  Pause,
  CalendarToday,
  Schedule,
  Refresh,
} from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';
import { TaskCreate } from '../types';
import { useLocation } from 'react-router-dom';

const Tasks: React.FC = () => {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TaskCreate>>({
    title: '',
    description: '',
    priority: 'medium',
  });

  // Handle tab parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const tabIndex = parseInt(tabParam);
      if (tabIndex >= 0 && tabIndex <= 4) {
        setTabValue(tabIndex);
      }
    }
  }, [location.search]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  const handleStatusToggle = (task: any) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { status: newStatus });
  };



  const handleTaskAction = (task: any) => {
    if (task.status === 'pending') {
      // Instant start task
      updateTask(task.id, { status: 'in_progress' });
    } else if (task.status === 'in_progress') {
      // Pause task
      updateTask(task.id, { status: 'paused' });
    } else if (task.status === 'paused') {
      // Resume task
    updateTask(task.id, { status: 'in_progress' });
    } else if (task.status === 'completed') {
      // Restart task
      updateTask(task.id, { status: 'pending' });
    } else if (task.status === 'overdue') {
      // Reschedule overdue task - open reschedule dialog
      // For now, we'll just restart it, but you can implement a reschedule dialog later
      updateTask(task.id, { status: 'pending' });
    }
  };

  const getTaskActionIcon = (task: any) => {
    if (task.status === 'pending') {
      return <PlayArrow fontSize="small" />; // Instant start
    } else if (task.status === 'in_progress') {
      return <Pause fontSize="small" />; // Pause
    } else if (task.status === 'paused') {
      return <PlayArrow fontSize="small" />; // Resume
    } else if (task.status === 'completed') {
      return <Refresh fontSize="small" />; // Restart
    } else if (task.status === 'overdue') {
      return <Schedule fontSize="small" />; // Reschedule
    }
    return <PlayArrow fontSize="small" />;
  };

  const getTaskActionColor = (task: any) => {
    if (task.status === 'pending') {
      return 'primary';
    } else if (task.status === 'in_progress') {
      return 'warning';
    } else if (task.status === 'paused') {
      return 'primary';
    } else if (task.status === 'completed') {
      return 'success';
    } else if (task.status === 'overdue') {
      return 'error';
    }
    return 'primary';
  };

  const getTaskActionTitle = (task: any) => {
    if (task.status === 'pending') {
      return 'Instant Start';
    } else if (task.status === 'in_progress') {
      return 'Pause Task';
    } else if (task.status === 'paused') {
      return 'Resume Task';
    } else if (task.status === 'completed') {
      return 'Restart Task';
    } else if (task.status === 'overdue') {
      return 'Reschedule Task';
    }
    return 'Action';
  };

  const formatDate = (date: Date) => {
    const day = new Date(date).getDate();
    const month = new Date(date).toLocaleDateString('en-US', { month: 'long' });
    const year = new Date(date).getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'paused': return 'info';
      case 'pending': return 'default';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const filteredTasks = () => {
    switch (tabValue) {
      case 0: return tasks.sort((a, b) => {
        // Sort by due date first, then by creation date (most recent first)
        const aDate = a.dueDate || a.createdAt;
        const bDate = b.dueDate || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      }); // All - sorted by date/time (most recent first)
      case 1: return tasks.filter(task => task.status === 'pending');
      case 2: return tasks.filter(task => task.status === 'in_progress' || task.status === 'paused');
      case 3: return tasks.filter(task => task.status === 'completed');
      case 4: return tasks.filter(task => task.status === 'overdue'); // Overdue
      default: return tasks;
    }
  };

  const allTasksCount = tasks.length;
  const pendingTasksCount = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasksCount = tasks.filter(task => task.status === 'in_progress' || task.status === 'paused').length;
  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
  const overdueTasksCount = tasks.filter(task => task.status === 'overdue').length;

  return (
    <Box>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, mt: 0, pt: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.5 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 0 }}>
            <Tab label={`All (${allTasksCount})`} />
            <Tab label={`Pending (${pendingTasksCount})`} />
            <Tab label={`In Progress (${inProgressTasksCount})`} />
            <Tab label={`Completed (${completedTasksCount})`} />
            <Tab label={`Overdue (${overdueTasksCount})`} />
          </Tabs>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ mr: 2, py: 1 }}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {/* Task List */}
      <Box>
        {filteredTasks().length === 0 ? (
          <Card>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {tabValue === 0 
                  ? "Create your first task to get started"
                  : tabValue === 1 
                    ? "No pending tasks"
                    : tabValue === 2 
                      ? "No in progress or paused tasks"
                      : tabValue === 3 
                        ? "No completed tasks"
                        : "No overdue tasks"
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
          {filteredTasks().map((task) => (
              <Grid item xs={12} sm={6} key={task.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                                    <CardContent sx={{ 
                    p: 2.5, 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:last-child': { pb: 2.5 }
                  }}>
                    {/* Header Row - Checkbox and Title */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 1.5,
                      minHeight: 40
                    }}>
                    <Checkbox
                      checked={task.status === 'completed'}
                      onChange={() => handleStatusToggle(task)}
                      color="primary"
                        size="small"
                        sx={{ 
                          mr: 1.5,
                          '&.Mui-checked': {
                            color: 'success.main'
                          }
                        }}
                      />
                        <Typography 
                        variant="body2" 
                        fontWeight={600}
                          sx={{ 
                          flex: 1,
                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                            color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: '0.875rem',
                          }}
                        >
                        {task.title}
                      </Typography>
                    </Box>

                    {/* Content Area - Aligned with title */}
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      pl: 4.5, // Align with title (checkbox width + margin)
                      justifyContent: 'space-between'
                    }}>
                      {/* Description */}
                      {task.description && (
                          <Typography 
                          variant="caption" 
                            color="textSecondary" 
                          sx={{ 
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                            fontSize: '0.75rem',
                          }}
                          >
                          {task.description}
                        </Typography>
                      )}
                        
                      {/* Due Date */}
                      {task.dueDate && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          mb: 1.5
                        }}>
                          <CalendarToday sx={{ 
                            fontSize: '0.8rem', 
                            color: 'text.secondary' 
                          }} />
                          <Typography 
                            variant="caption" 
                            color="textSecondary"
                            sx={{ 
                              fontSize: '0.7rem',
                              fontWeight: 500
                            }}
                          >
                            {formatDate(task.dueDate)}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Bottom Row - Status, Priority, and Actions */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      pt: 1.5,
                      mt: 'auto',
                      pl: 4.5 // Align with description and title
                    }}>
                      {/* Status and Priority Chips */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 0.75, 
                        alignItems: 'center'
                      }}>
                        <Chip
                          label={task.priority}
                          size="small"
                          color={getPriorityColor(task.priority) as any}
                            variant="outlined"
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: 22,
                            fontWeight: 500,
                            borderWidth: 1.5
                          }}
                        />
                        {tabValue === 0 && (
                        <Chip
                          label={task.status}
                          size="small"
                          color={getStatusColor(task.status) as any}
                            variant="outlined"
                            sx={{ 
                              fontSize: '0.7rem', 
                              height: 22,
                              fontWeight: 500,
                              borderWidth: 1.5
                            }}
                          />
                        )}
                    </Box>
                      
                      {/* Action Buttons */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        alignItems: 'center'
                      }}>
                        <Tooltip title={getTaskActionTitle(task)}>
                        <IconButton
                          size="small"
                          onClick={() => handleTaskAction(task)}
                          color={getTaskActionColor(task)}
                          sx={{ 
                            width: 32, 
                            height: 32,
                            '&:hover': {
                              backgroundColor: `${getTaskActionColor(task)}.light`,
                              color: `${getTaskActionColor(task)}.contrastText`
                            }
                          }}
                        >
                          {getTaskActionIcon(task)}
                    </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Task">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTask(task.id)}
                          color="error"
                          sx={{ 
                            width: 32, 
                            height: 32,
                            '&:hover': {
                              backgroundColor: 'error.light'
                            }
                          }}
                        >
                          <Delete sx={{ fontSize: '1rem' }} />
                        </IconButton>
                        </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
              </Grid>
          ))}
          </Grid>
        )}
      </Box>

      {/* Add Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent sx={{ p: 2 }}>
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
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newTask.dueDate ? newTask.dueDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setNewTask({ 
              ...newTask, 
              dueDate: e.target.value ? new Date(e.target.value) : undefined 
            })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained" disabled={!newTask.title}>
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks; 