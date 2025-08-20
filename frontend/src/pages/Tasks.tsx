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
  Select,
  MenuItem,
  Tabs,
  Tab,
  Checkbox,
  Chip,
  IconButton,
  Grid,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
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
  Search,
  Clear,
  Edit,
  AccessTime,
  Sort,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Title as TitleIcon,
  DateRange as DateRangeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';
import { TaskCreate } from '../types';
import { useLocation } from 'react-router-dom';
import TagsInput from '../components/ui/TagsInput';

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
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPriority, setSearchPriority] = useState<string>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortCriteria, setSortCriteria] = useState<{field: string, direction: 'asc' | 'desc'} | null>(null);

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
        const taskData = {
          ...newTask,
          tags: newTaskTags ? newTaskTags.filter(tag => tag) : []
        };
        await createTask(taskData as TaskCreate);
        setNewTask({ title: '', description: '', priority: 'medium' });
        setNewTaskTags([]);
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

  const handleEditTask = (task: any) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      estimatedDuration: task.estimatedDuration || '',
      tags: task.tags || []
    });
    setEditDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    if (editingTask && editingTask.title) {
      try {
        const updateData: any = {
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
        };
        
        if (editingTask.dueDate) {
          updateData.dueDate = new Date(editingTask.dueDate);
        }
        
        if (editingTask.estimatedDuration) {
          updateData.estimatedDuration = parseInt(editingTask.estimatedDuration);
        }

        if (editingTask.tags) {
          updateData.tags = editingTask.tags;
        }
        
        await updateTask(editingTask.id, updateData);
        setEditDialogOpen(false);
        setEditingTask(null);
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortOption = (field: string, direction: 'asc' | 'desc') => {
    setSortCriteria({ field, direction });
    setSortAnchorEl(null);
  };

  const handleSortClear = () => {
    setSortCriteria(null);
    setSortAnchorEl(null);
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
    let filtered = tasks;
    
    // Apply tab filtering
    switch (tabValue) {
      case 0: 
        filtered = tasks;
        break;
      case 1: 
        filtered = tasks.filter(task => task.status === 'pending');
        break;
      case 2: 
        filtered = tasks.filter(task => task.status === 'in_progress' || task.status === 'paused');
        break;
      case 3: 
        filtered = tasks.filter(task => task.status === 'completed');
        break;
      case 4: 
        filtered = tasks.filter(task => task.status === 'overdue'); // Overdue
        break;
      default: 
        filtered = tasks;
    }
    
    // Apply search query filtering
    if (searchQuery.trim()) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply priority filtering
    if (searchPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === searchPriority);
    }
    
    // Apply sorting
    if (sortCriteria) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortCriteria.field) {
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
            bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
            break;
          case 'dueDate':
            aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            break;
          case 'duration':
            aValue = a.estimatedDuration || 0;
            bValue = b.estimatedDuration || 0;
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'status':
            const statusOrder = { pending: 1, in_progress: 2, paused: 3, completed: 4, overdue: 5 };
            aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
            bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
            break;
          default:
            return 0;
        }
        
        if (sortCriteria.direction === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    } else {
      // Default sorting for "All" tab - by due date first, then by creation date
      if (tabValue === 0) {
        filtered = filtered.sort((a, b) => {
        const aDate = a.dueDate || a.createdAt;
        const bDate = b.dueDate || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
      }
    }
    
    return filtered;
  };

  const filteredTasksList = filteredTasks();
  const allTasksCount = isSearchOpen ? filteredTasksList.length : tasks.length;
  const pendingTasksCount = isSearchOpen ? filteredTasksList.filter(task => task.status === 'pending').length : tasks.filter(task => task.status === 'pending').length;
  const inProgressTasksCount = isSearchOpen ? filteredTasksList.filter(task => task.status === 'in_progress' || task.status === 'paused').length : tasks.filter(task => task.status === 'in_progress' || task.status === 'paused').length;
  const completedTasksCount = isSearchOpen ? filteredTasksList.filter(task => task.status === 'completed').length : tasks.filter(task => task.status === 'completed').length;
  const overdueTasksCount = isSearchOpen ? filteredTasksList.filter(task => task.status === 'overdue').length : tasks.filter(task => task.status === 'overdue').length;

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
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             {/* Search Button */}
             <Button
               variant="outlined"
               startIcon={<Search />}
               onClick={() => setIsSearchOpen(!isSearchOpen)}
               sx={{ py: 1 }}
             >
               Search
             </Button>
                           {/* Sort Button */}
              <Button
                variant={sortCriteria ? "contained" : "outlined"}
                startIcon={<Sort />}
                onClick={handleSortClick}
                sx={{ py: 1 }}
              >
                Sort
              </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
               sx={{ py: 1 }}
          >
            Add Task
          </Button>
        </Box>
        </Box>
        
        {/* Search Interface */}
        {isSearchOpen && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center', 
            py: 2,
            borderTop: 1,
            borderColor: 'divider'
          }}>
            <TextField
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ mr: -0.5 }}
                  >
                    <Clear />
                  </IconButton>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={searchPriority}
                onChange={(e) => setSearchPriority(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="high">High Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="low">Low Priority</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setSearchPriority('all');
                setIsSearchOpen(false);
              }}
              size="small"
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>

      {/* Task List */}
      <Box>
        {filteredTasksList.length === 0 ? (
          <Card>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {isSearchOpen && (searchQuery || searchPriority !== 'all')
                  ? "No tasks match your search criteria"
                  : tabValue === 0 
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
          {filteredTasksList.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
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
                    p: 1, 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:last-child': { pb: 1.5 }
                  }}>
                    {/* Header Row - Checkbox and Title */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
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
                        variant="h6" 
                        fontWeight={600}
                          sx={{ 
                          flex: 1,
                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                            color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          }}
                        >
                        {task.title}
                      </Typography>
                    </Box>

                    {/* Content Area - Two columns: description and meta */}
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'row',
                      pl: 3, // Align with title (checkbox width + margin)
                      alignItems: 'stretch',
                      gap: 0
                    }}>
                      {/* Left: Description container fills remaining space */}
                      <Box sx={{ flex: 1, pr: 1, minWidth: 0 }}>
                      {task.description && (
                          <Typography 
                            variant="body2" 
                            color="textSecondary" 
                            sx={{ 
                              mb: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 5,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.5,
                              whiteSpace: 'normal',
                              wordBreak: 'break-word'
                            }}
                          >
                          {task.description}
                        </Typography>
                      )}
                      </Box>

                      <Divider orientation="vertical" flexItem />

                      {/* Right: Meta container fits content */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, maxWidth: '50%', p: 1, pt: 0 }}>
                        {task.dueDate && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5
                          }}>
                            <CalendarToday sx={{ 
                              fontSize: 20, 
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
                              Due: {formatDate(task.dueDate)}
                            </Typography>
                          </Box>
                        )}
                        {task.estimatedDuration && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5
                          }}>
                            <AccessTime sx={{ 
                              fontSize: 20, 
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
                               {task.estimatedDuration} minutes
                            </Typography>
                          </Box>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap',
                            gap: 0.5,
                            maxHeight: 44,
                            overflow: 'hidden'
                          }}>
                            {(task.tags.slice(0, 6)).map((tag: string, index: number) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  fontSize: '0.65rem', 
                                  height: 20,
                                  fontWeight: 500,
                                  borderWidth: 1,
                                  borderColor: 'grey.300',
                                  color: 'text.secondary',
                                  backgroundColor: 'transparent',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                  }
                                }}
                              />
                            ))}
                            {task.tags.length > 6 && (
                              <Chip
                                label="..."
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  height: 20,
                                  fontWeight: 600,
                                  borderWidth: 1,
                                  borderColor: 'grey.300'
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Bottom Row - Status, Priority, and Actions */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      pt: 1,
                      mt: 'auto',
                      pl: 3 // Align with description and title
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
                         <Tooltip title="Edit Task">
                        <IconButton
                          size="small"
                             onClick={() => handleEditTask(task)}
                             color="primary"
                             sx={{ 
                               width: 32, 
                               height: 32,
                               '&:hover': {
                                 backgroundColor: 'primary.light',
                                 color: 'primary.contrastText'
                               }
                             }}
                           >
                             <Edit fontSize="small" />
                    </IconButton>
                         </Tooltip>
                         
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
                          <Delete fontSize="small" />
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
           
           {/* Priority Selection */}
           <Box sx={{ mb: 2 }}>
             <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
               Priority
             </Typography>
             <Box sx={{ display: 'flex', gap: 1 }}>
               <Button
                 variant={newTask.priority === 'low' ? 'contained' : 'outlined'}
                 size="small"
                 onClick={() => setNewTask({ ...newTask, priority: 'low' })}
                 sx={{ flex: 1 }}
               >
                 Low
               </Button>
               <Button
                 variant={newTask.priority === 'medium' ? 'contained' : 'outlined'}
                 size="small"
                 onClick={() => setNewTask({ ...newTask, priority: 'medium' })}
                 sx={{ flex: 1 }}
               >
                 Medium
               </Button>
               <Button
                 variant={newTask.priority === 'high' ? 'contained' : 'outlined'}
                 size="small"
                 onClick={() => setNewTask({ ...newTask, priority: 'high' })}
                 sx={{ flex: 1 }}
               >
                 High
               </Button>
             </Box>
           </Box>
           
           {/* Due Date and Estimated Duration on same line */}
           <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
               sx={{ flex: 1 }}
            variant="outlined"
            value={newTask.dueDate ? newTask.dueDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setNewTask({ 
              ...newTask, 
              dueDate: e.target.value ? new Date(e.target.value) : undefined 
            })}
            InputLabelProps={{ shrink: true }}
             />
                           <TextField
                margin="dense"
                label="Duration (min)"
                type="number"
                inputProps={{ min: 1 }}
                sx={{ flex: 1 }}
                variant="outlined"
                value={newTask.estimatedDuration || ''}
                onChange={(e) => setNewTask({ 
                  ...newTask, 
                  estimatedDuration: e.target.value ? parseInt(e.target.value) : undefined 
                })}
              />
           </Box>
                       <TagsInput
              value={newTaskTags}
              onChange={setNewTaskTags}
              placeholder="Type and press Enter to add tags..."
              label="Tags"
              helperText="Add tags to categorize your task"
              limit={10}
          />
        </DialogContent>
          <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained" disabled={!newTask.title}>
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

               {/* Edit Task Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              fullWidth
              variant="outlined"
              value={editingTask?.title || ''}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={editingTask?.description || ''}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            />
            {/* Priority Selection */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Priority
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={editingTask?.priority === 'low' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setEditingTask({ ...editingTask, priority: 'low' })}
                  sx={{ flex: 1 }}
                >
                  Low
                </Button>
                <Button
                  variant={editingTask?.priority === 'medium' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setEditingTask({ ...editingTask, priority: 'medium' })}
                  sx={{ flex: 1 }}
                >
                  Medium
                </Button>
                <Button
                  variant={editingTask?.priority === 'high' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setEditingTask({ ...editingTask, priority: 'high' })}
                  sx={{ flex: 1 }}
                >
                  High
                </Button>
              </Box>
            </Box>
            
            {/* Due Date and Estimated Duration on same line */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                margin="dense"
                label="Due Date"
                type="date"
                sx={{ flex: 1 }}
                variant="outlined"
                value={editingTask?.dueDate || ''}
                onChange={(e) => setEditingTask({ 
                  ...editingTask, 
                  dueDate: e.target.value 
                })}
                InputLabelProps={{ shrink: true }}
              />
                             <TextField
                 margin="dense"
                 label="Duration (min)"
                 type="number"
                 inputProps={{ min: 1 }}
                 sx={{ flex: 1 }}
                 variant="outlined"
                 value={editingTask?.estimatedDuration || ''}
                 onChange={(e) => setEditingTask({ 
                   ...editingTask, 
                   estimatedDuration: e.target.value 
                 })}
               />
            </Box>
            <TagsInput
              value={editingTask?.tags || []}
              onChange={(tags) => setEditingTask({ 
                ...editingTask, 
                tags: tags 
              })}
              placeholder="Type and press Enter to add tags..."
              label="Tags"
              helperText="Add tags to categorize your task"
              limit={10}
                         />
           </DialogContent>
           <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTask} variant="contained" disabled={!editingTask?.title}>
              Update Task
            </Button>
          </DialogActions>
        </Dialog>

                 {/* Sort Popover */}
         <Popover
           open={Boolean(sortAnchorEl)}
           anchorEl={sortAnchorEl}
           onClose={handleSortClose}
           anchorOrigin={{
             vertical: 'bottom',
             horizontal: 'left',
           }}
           transformOrigin={{
             vertical: 'top',
             horizontal: 'left',
           }}
           PaperProps={{
             sx: {
               minWidth: 280,
               maxHeight: 400,
               overflow: 'auto',
               mt: 1,
               boxShadow: 3,
               border: '1px solid',
               borderColor: 'divider',
             }
           }}
         >
           <List sx={{ py: 0 }}>
             {/* Clear Sort Option */}
             <ListItem 
               button 
               onClick={handleSortClear}
               sx={{ 
                 backgroundColor: !sortCriteria ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <CheckCircleIcon color={!sortCriteria ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="None (Default)" 
                 primaryTypographyProps={{ 
                   color: !sortCriteria ? "primary" : "textPrimary",
                   fontWeight: !sortCriteria ? 600 : 400
                 }}
               />
             </ListItem>
             
             <Divider />
             
             {/* Priority */}
             <ListItem 
               button 
               onClick={() => handleSortOption('priority', 'asc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'priority' && sortCriteria?.direction === 'asc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <ScheduleIcon color={sortCriteria?.field === 'priority' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Priority: Low to High" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'priority' && sortCriteria?.direction === 'asc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'priority' && sortCriteria?.direction === 'asc' ? 600 : 400
                 }}
               />
               <KeyboardArrowUp color={sortCriteria?.field === 'priority' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
             </ListItem>
             <ListItem 
               button 
               onClick={() => handleSortOption('priority', 'desc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'priority' && sortCriteria?.direction === 'desc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <ScheduleIcon color={sortCriteria?.field === 'priority' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Priority: High to Low" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'priority' && sortCriteria?.direction === 'desc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'priority' && sortCriteria?.direction === 'desc' ? 600 : 400
                 }}
               />
               <KeyboardArrowDown color={sortCriteria?.field === 'priority' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
             </ListItem>
             
             <Divider />
             
             {/* Due Date */}
             <ListItem 
               button 
               onClick={() => handleSortOption('dueDate', 'asc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'asc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <DateRangeIcon color={sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Due Date: Earliest First" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'asc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'asc' ? 600 : 400
                 }}
               />
               <KeyboardArrowUp color={sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
             </ListItem>
             <ListItem 
               button 
               onClick={() => handleSortOption('dueDate', 'desc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'desc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <DateRangeIcon color={sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Due Date: Latest First" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'desc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'desc' ? 600 : 400
                 }}
               />
               <KeyboardArrowDown color={sortCriteria?.field === 'dueDate' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
             </ListItem>
             
             <Divider />
             
             {/* Duration */}
             <ListItem 
               button 
               onClick={() => handleSortOption('duration', 'asc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'duration' && sortCriteria?.direction === 'asc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <AccessTimeIcon color={sortCriteria?.field === 'duration' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Duration: Shortest First" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'duration' && sortCriteria?.direction === 'asc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'duration' && sortCriteria?.direction === 'asc' ? 600 : 400
                 }}
               />
               <KeyboardArrowUp color={sortCriteria?.field === 'duration' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
             </ListItem>
             <ListItem 
               button 
               onClick={() => handleSortOption('duration', 'desc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'duration' && sortCriteria?.direction === 'desc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <AccessTimeIcon color={sortCriteria?.field === 'duration' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Duration: Longest First" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'duration' && sortCriteria?.direction === 'desc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'duration' && sortCriteria?.direction === 'desc' ? 600 : 400
                 }}
               />
               <KeyboardArrowDown color={sortCriteria?.field === 'duration' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
             </ListItem>
             
             <Divider />
             
             {/* Title */}
             <ListItem 
               button 
               onClick={() => handleSortOption('title', 'asc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'title' && sortCriteria?.direction === 'asc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <TitleIcon color={sortCriteria?.field === 'title' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Title: A to Z" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'title' && sortCriteria?.direction === 'asc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'title' && sortCriteria?.direction === 'asc' ? 600 : 400
                 }}
               />
               <KeyboardArrowUp color={sortCriteria?.field === 'title' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
             </ListItem>
             <ListItem 
               button 
               onClick={() => handleSortOption('title', 'desc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'title' && sortCriteria?.direction === 'desc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <TitleIcon color={sortCriteria?.field === 'title' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Title: Z to A" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'title' && sortCriteria?.direction === 'desc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'title' && sortCriteria?.direction === 'desc' ? 600 : 400
                 }}
               />
               <KeyboardArrowDown color={sortCriteria?.field === 'title' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
             </ListItem>
             
             <Divider />
             
             {/* Created Date */}
             <ListItem 
               button 
               onClick={() => handleSortOption('createdAt', 'asc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'asc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <DateRangeIcon color={sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Created Date: Oldest First" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'asc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'asc' ? 600 : 400
                 }}
               />
               <KeyboardArrowUp color={sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
             </ListItem>
             <ListItem 
               button 
               onClick={() => handleSortOption('createdAt', 'desc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'desc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <DateRangeIcon color={sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Created Date: Newest First" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'desc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'desc' ? 600 : 400
                 }}
               />
               <KeyboardArrowDown color={sortCriteria?.field === 'createdAt' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
             </ListItem>
             
             <Divider />
             
             {/* Status */}
             <ListItem 
               button 
               onClick={() => handleSortOption('status', 'asc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'status' && sortCriteria?.direction === 'asc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <CheckCircleIcon color={sortCriteria?.field === 'status' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Status: Pending First" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'status' && sortCriteria?.direction === 'asc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'status' && sortCriteria?.direction === 'asc' ? 600 : 400
                 }}
               />
               <KeyboardArrowUp color={sortCriteria?.field === 'status' && sortCriteria?.direction === 'asc' ? "primary" : "action"} />
             </ListItem>
             <ListItem 
               button 
               onClick={() => handleSortOption('status', 'desc')}
               sx={{ 
                 backgroundColor: sortCriteria?.field === 'status' && sortCriteria?.direction === 'desc' ? 'action.selected' : 'transparent',
                 '&:hover': { backgroundColor: 'action.hover' }
               }}
             >
               <ListItemIcon>
                 <CheckCircleIcon color={sortCriteria?.field === 'status' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
               </ListItemIcon>
               <ListItemText 
                 primary="Status: Completed First" 
                 primaryTypographyProps={{ 
                   color: sortCriteria?.field === 'status' && sortCriteria?.direction === 'desc' ? "primary" : "textPrimary",
                   fontWeight: sortCriteria?.field === 'status' && sortCriteria?.direction === 'desc' ? 600 : 400
                 }}
               />
               <KeyboardArrowDown color={sortCriteria?.field === 'status' && sortCriteria?.direction === 'desc' ? "primary" : "action"} />
             </ListItem>
           </List>
         </Popover>
    </Box>
  );
};

export default Tasks; 