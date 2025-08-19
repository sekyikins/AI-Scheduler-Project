import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  Paper,
} from '@mui/material';
import {
  SmartToy,
  Send,
  ExpandMore,
  ExpandLess,
  Add,
  Assignment,
  TrendingUp,
  Lightbulb,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { TaskCreate } from '../types';
import { aiAPI } from '../services/api';

interface AIInterfaceProps {
  onTaskCreated?: (task: TaskCreate) => void;
}

const AIInterface: React.FC<AIInterfaceProps> = ({ onTaskCreated }) => {
  const theme = useTheme();
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!command.trim()) return;

    setLoading(true);
    try {
      const result = await aiAPI.parseCommand(command);
      setResponse(result.data);
      setCommand('');
    } catch (error) {
      console.error('AI command failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleCreateTask = (task: TaskCreate) => {
    if (onTaskCreated) {
      onTaskCreated(task);
    }
  };

  const formatDate = (date: Date) => {
    const day = new Date(date).getDate();
    const month = new Date(date).toLocaleDateString('en-US', { month: 'long' });
    const year = new Date(date).getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const quickCommands = [
    'Create a high priority task for project review',
    'Schedule a meeting for tomorrow at 2 PM',
    'Generate tasks for this week',
    'Optimize my current task schedule',
  ];

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            <SmartToy />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              AI Assistant
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Describe what you need, and I'll help you manage it
            </Typography>
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Try: 'Create a task for project review due tomorrow' or 'Schedule a meeting for Friday'"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <Button
                  onClick={handleSubmit}
                  disabled={!command.trim() || loading}
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <Send fontSize="small" />
                </Button>
              ),
            }}
          />
        </Box>

        {loading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              AI is thinking...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        <Collapse in={expanded}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Quick commands:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {quickCommands.map((cmd, index) => (
                <Chip
                  key={index}
                  label={cmd}
                  size="small"
                  variant="outlined"
                  onClick={() => setCommand(cmd)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        </Collapse>

        {response && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Lightbulb color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                AI Response
              </Typography>
            </Box>
            
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {response.message}
            </Typography>

            {response.tasks && response.tasks.length > 0 && (
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Suggested Tasks:
                </Typography>
                <List dense>
                  {response.tasks.map((task: TaskCreate, index: number) => (
                    <ListItem
                      key={index}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: 'background.paper',
                      }}
                      secondaryAction={
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => handleCreateTask(task)}
                        >
                          Add
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        <Assignment color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="textSecondary">
                              {task.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip
                                label={task.priority}
                                size="small"
                                color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                                variant="outlined"
                              />
                              {task.dueDate && (
                                <Chip
                                  label={formatDate(task.dueDate)}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {response.confidence && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TrendingUp fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  Confidence: {(response.confidence * 100).toFixed(0)}%
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInterface; 