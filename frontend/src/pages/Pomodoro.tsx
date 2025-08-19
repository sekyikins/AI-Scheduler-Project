import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  LinearProgress,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Timer,
  Assignment,
  Settings,
  VolumeUp,
  VolumeOff,
  SkipNext,
  MoreVert,
} from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';

interface PomodoroSession {
  id: string;
  taskId?: string;
  customTaskText?: string;
  duration: number;
  type: 'work' | 'break' | 'long_break';
  completed: boolean;
  startTime: Date;
  endTime?: Date;
  actualDuration?: number;
}

interface PomodoroStats {
  totalSessions: number;
  completedSessions: number;
  totalWorkTime: number;
  totalBreakTime: number;
  averageSessionLength: number;
  currentStreak: number;
}

const Pomodoro: React.FC = () => {
  const { tasks } = useTasks();
  
  // Settings
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);

  const workTime = workDuration * 60;
  const breakTime = breakDuration * 60;
  const longBreakTime = longBreakDuration * 60;

  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [customTaskInput, setCustomTaskInput] = useState<string>('');
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartSessions, setAutoStartSessions] = useState(false);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      taskId: selectedTask || undefined,
      customTaskText: customTaskInput || undefined,
      duration: isBreak ? (sessions.filter(s => s.type === 'work' && s.completed).length % sessionsUntilLongBreak === 0 ? longBreakTime : breakTime) : workTime,
      type: isBreak ? (sessions.filter(s => s.type === 'work' && s.completed).length % sessionsUntilLongBreak === 0 ? 'long_break' : 'break') : 'work',
      completed: false,
      startTime: new Date(),
    };
    setCurrentSession(newSession);
    setSessions(prev => [...prev, newSession]);
  }, [selectedTask, customTaskInput, isBreak, sessions, sessionsUntilLongBreak, longBreakTime, breakTime, workTime]);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    
    if (currentSession) {
      setSessions(prev => 
        prev.map(session => 
          session.id === currentSession.id 
            ? { ...session, completed: true, endTime: new Date(), actualDuration: currentSession.duration }
            : session
        )
      );
      setCurrentSession(null);
    }
    
    // Play notification sound if enabled
    if (soundEnabled) {
      // TODO: Implement actual sound notification
      console.log('Session completed - playing notification sound');
    }
    
    // Switch between work and break
    if (isBreak) {
      setTimeLeft(workTime);
      setIsBreak(false);
      if (autoStartSessions) {
        setTimeout(() => handleStart(), 1000);
      }
    } else {
      setTimeLeft(breakTime);
      setIsBreak(true);
      if (autoStartBreaks) {
        setTimeout(() => handleStart(), 1000);
      }
    }
  }, [currentSession, soundEnabled, isBreak, workTime, breakTime, autoStartSessions, autoStartBreaks, handleStart]);

  // Sync timer with settings changes
  useEffect(() => {
    if (!isRunning && !currentSession) {
      setTimeLeft(isBreak ? breakTime : workTime);
    }
  }, [workDuration, breakDuration, isBreak, workTime, breakTime, isRunning, currentSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, currentSession, handleSessionComplete]);

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (currentSession) {
      setSessions(prev => 
        prev.map(session => 
          session.id === currentSession.id 
            ? { ...session, completed: false, endTime: new Date(), actualDuration: currentSession.duration - timeLeft }
            : session
        )
      );
      setCurrentSession(null);
    }
    setTimeLeft(isBreak ? breakTime : workTime);
  };

  const handleSkip = () => {
    handleSessionComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = currentSession?.duration || (isBreak ? breakTime : workTime);
    return ((total - timeLeft) / total) * 100;
  };

  const getStats = (): PomodoroStats => {
    const completedSessions = sessions.filter(s => s.completed);
    const workSessions = completedSessions.filter(s => s.type === 'work');
    const breakSessions = completedSessions.filter(s => s.type === 'break' || s.type === 'long_break');
    
    return {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      totalWorkTime: workSessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0),
      totalBreakTime: breakSessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0),
      averageSessionLength: completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0) / completedSessions.length 
        : 0,
      currentStreak: 0, // TODO: Implement streak calculation
    };
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const stats = getStats();



  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'work': return 'Work';
      case 'break': return 'Break';
      case 'long_break': return 'Long Break';
      default: return 'Unknown';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Main Timer Section */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="textSecondary">
                  {isBreak ? (currentSession?.type === 'long_break' ? 'Long Break' : 'Short Break') : 'Work Session'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Sound">
                    <IconButton 
                      size="small" 
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      color={soundEnabled ? 'primary' : 'default'}
                    >
                      {soundEnabled ? <VolumeUp /> : <VolumeOff />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                      <Settings />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={getProgress()}
                  size={180}
                  thickness={6}
                  color={isBreak ? 'success' : 'primary'}
                  sx={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h2" component="div" color="textPrimary" fontWeight={300}>
                    {formatTime(timeLeft)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    {isBreak ? 'Take a break!' : 'Stay focused!'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
                {!isRunning ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={handleStart}
                    disabled={!selectedTask && !customTaskInput && !isBreak}
                    sx={{ minWidth: 120 }}
                  >
                    Start
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Pause />}
                      onClick={handlePause}
                      sx={{ minWidth: 120 }}
                    >
                      Pause
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Stop />}
                      onClick={handleStop}
                      color="error"
                      sx={{ minWidth: 120 }}
                    >
                      Stop
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<SkipNext />}
                      onClick={handleSkip}
                      sx={{ minWidth: 120 }}
                    >
                      Skip
                    </Button>
                  </>
                )}
              </Box>

              <Autocomplete
                freeSolo
                options={pendingTasks.map(task => task.title)}
                value={selectedTask ? (tasks.find(t => t.id === selectedTask)?.title || '') : customTaskInput}
                onChange={(event, newValue) => {
                  if (newValue) {
                    const task = tasks.find(t => t.title === newValue);
                    if (task) {
                      setSelectedTask(task.id);
                      setCustomTaskInput('');
                    } else {
                      // Custom input
                      setSelectedTask('');
                      setCustomTaskInput(newValue);
                    }
                  } else {
                    setSelectedTask('');
                    setCustomTaskInput('');
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  if (!pendingTasks.find(t => t.title === newInputValue)) {
                    setCustomTaskInput(newInputValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Task (Optional for breaks)"
                    variant="outlined"
                    disabled={isRunning}
                  />
                )}
                sx={{ maxWidth: 400, mx: 'auto' }}
              />

              {(selectedTask || customTaskInput) && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={selectedTask ? (tasks.find(t => t.id === selectedTask)?.title || '') : customTaskInput}
                    color="primary"
                    variant="outlined"
                    onDelete={() => {
                      setSelectedTask('');
                      setCustomTaskInput('');
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight={600}>
                    {stats.completedSessions}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sessions Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight={600}>
                    {Math.floor(stats.totalWorkTime / 60)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Work Minutes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color="warning.main" fontWeight={600}>
                    {Math.floor(stats.totalBreakTime / 60)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Break Minutes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color="info.main" fontWeight={600}>
                    {stats.currentStreak}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Day Streak
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Sessions" />
              <Tab label="Stats" />
              <Tab label="Tips" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Sessions
                  </Typography>
                  <Tooltip title="More options">
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                  </Tooltip>
                </Box>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {sessions.slice(-10).reverse().map((session) => (
                    <ListItem key={session.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {session.type === 'work' ? <Assignment /> : <Timer />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {getSessionTypeLabel(session.type)}
                            </Typography>
                            <Chip
                              label={session.completed ? 'Completed' : 'Incomplete'}
                              size="small"
                              color={session.completed ? 'success' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {session.taskId 
                                ? tasks.find(t => t.id === session.taskId)?.title 
                                : session.customTaskText || 'No task selected'
                              }
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {session.startTime.toLocaleTimeString()} • {Math.floor(session.duration / 60)}min
                              {session.actualDuration && ` (${Math.floor(session.actualDuration / 60)}min actual)`}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                  {sessions.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No sessions yet"
                        secondary="Start a Pomodoro session to see your progress"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          )}

          {activeTab === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detailed Statistics
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Today's Progress
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.completedSessions / Math.max(stats.totalSessions, 1)) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {stats.completedSessions} of {stats.totalSessions} sessions completed
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Work vs Break Ratio
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Box sx={{ flex: 1, bgcolor: 'primary.main', height: 8, borderRadius: 1 }} />
                    <Box sx={{ flex: 1, bgcolor: 'success.main', height: 8, borderRadius: 1 }} />
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {Math.floor(stats.totalWorkTime / 60)}min work • {Math.floor(stats.totalBreakTime / 60)}min break
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    Session Averages
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average session length: {Math.floor(stats.averageSessionLength / 60)} minutes
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completion rate: {stats.totalSessions > 0 ? Math.round((stats.completedSessions / stats.totalSessions) * 100) : 0}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeTab === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pomodoro Technique Tips
                </Typography>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Work Sessions:</strong> Focus intensely for {workDuration} minutes without interruptions
                  </Typography>
                </Alert>
                
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Short Breaks:</strong> Take {breakDuration}-minute breaks to recharge and maintain focus
                  </Typography>
                </Alert>
                
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Long Breaks:</strong> After {sessionsUntilLongBreak} work sessions, take a {longBreakDuration}-minute break
                  </Typography>
                </Alert>
                
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Best Practices:</strong> Eliminate distractions, use a dedicated workspace, and track your progress
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Pomodoro Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Timer Durations</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Work Duration: {workDuration} minutes
              </Typography>
              <Slider
                value={workDuration}
                onChange={(e, value) => setWorkDuration(value as number)}
                min={1}
                max={60}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Break Duration: {breakDuration} minutes
              </Typography>
              <Slider
                value={breakDuration}
                onChange={(e, value) => setBreakDuration(value as number)}
                min={1}
                max={30}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Long Break Duration: {longBreakDuration} minutes
              </Typography>
              <Slider
                value={longBreakDuration}
                onChange={(e, value) => setLongBreakDuration(value as number)}
                min={5}
                max={60}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Sessions until Long Break: {sessionsUntilLongBreak}
              </Typography>
              <Slider
                value={sessionsUntilLongBreak}
                onChange={(e, value) => setSessionsUntilLongBreak(value as number)}
                min={2}
                max={8}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="h6" gutterBottom>Preferences</Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
              }
              label="Enable sound notifications"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={autoStartBreaks}
                  onChange={(e) => setAutoStartBreaks(e.target.checked)}
                />
              }
              label="Auto-start breaks"
              sx={{ mb: 1 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={autoStartSessions}
                  onChange={(e) => setAutoStartSessions(e.target.checked)}
                />
              }
              label="Auto-start work sessions"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={() => setSettingsOpen(false)} variant="contained">Save Settings</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pomodoro; 