import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  SmartToy,
  ArrowUpward,
  Add,
  Assignment,
  TrendingUp,
  History,
  AutoAwesome,
  Mic,
  AttachFile,
} from '@mui/icons-material';
import { TaskCreate } from '../types';
import { aiAPI } from '../services/api';
import { useTasks } from '../contexts/TaskContext';

interface Conversation {
  id: string;
  title: string;
  messages: Array<{command: string, response: any}>;
  createdAt: Date;
}

const Assistant: React.FC = () => {
  const theme = useTheme();
  const { createTask } = useTasks();
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [historyAnchorEl, setHistoryAnchorEl] = useState<null | HTMLElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!command.trim()) return;

    setLoading(true);
    try {
      const result = await aiAPI.parseCommand(command);
      const newResponse = result.data;
      setResponse(newResponse);
      
      // Create new conversation if none exists
      if (!currentConversation) {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: command.length > 30 ? `${command.substring(0, 30)}...` : command,
          messages: [{ command, response: newResponse }],
          createdAt: new Date(),
        };
        setCurrentConversation(newConversation);
        setConversations(prev => [newConversation, ...prev]);
      } else {
        // Add to existing conversation
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, { command, response: newResponse }],
        };
        setCurrentConversation(updatedConversation);
        setConversations(prev => 
          prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
        );
      }
      
      setCommand('');
      // Focus back to input field after submission
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('AI command failed:', error);
    } finally {
      setLoading(false);
      // Focus back to input field after error as well
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleCreateTask = async (task: TaskCreate) => {
    try {
      await createTask(task);
    } catch (error) {
      console.error('Failed to create AI task:', error);
    }
  };

  const handleHistoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setHistoryAnchorEl(event.currentTarget);
  };

  const handleHistoryClose = () => {
    setHistoryAnchorEl(null);
  };

  const handleNewConversation = () => {
    setCurrentConversation(null);
    setResponse(null);
    setCommand('');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setHistoryAnchorEl(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just add the filename to the command
      // In a real app, you'd upload the file and get a URL
      setCommand(prev => prev + ` [Attached: ${file.name}]`);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        // For now, just indicate recording was done
        // In a real app, you'd send this to a speech-to-text service
        setCommand(prev => prev + ' [Voice message recorded]');
        setAudioChunks(chunks);
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setAudioChunks([]);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Auto-scroll to bottom when new messages are added or loading starts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, response, loading]);

  const formatDate = (date: Date) => {
    const day = new Date(date).getDate();
    const month = new Date(date).toLocaleDateString('en-US', { month: 'long' });
    const year = new Date(date).getFullYear();
    return `${day} ${month}, ${year}`;
  };



  const ChatMessage: React.FC<{ message: { command: string; response: any } }> = ({ message }) => (
    <Box sx={{ mb: 3 }}>
      {/* User Command - Right Side */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, justifyContent: 'flex-end' }}>
        <Paper sx={{ p: 2, maxWidth: '70%', bgcolor: 'primary.50', textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={500}>
            {message.command}
          </Typography>
        </Paper>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, ml: 2, mt: 0.5 }}>
          <Assignment />
        </Avatar>
      </Box>

      {/* AI Response - Left Side */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2, mt: 0.5 }}>
          <SmartToy />
        </Avatar>
        <Paper sx={{ p: 2, maxWidth: '95%', ml: 2, bgcolor: 'rgba(161, 223, 39, 0)' }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {message.response.message}
          </Typography>

          {message.response.tasks && message.response.tasks.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Suggested Tasks:
              </Typography>
              <List dense>
                {message.response.tasks.map((task: TaskCreate, index: number) => (
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

          {message.response.confidence && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TrendingUp fontSize="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Confidence: {(message.response.confidence * 100).toFixed(0)}%
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      height: 'calc(100vh - 100px)', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: theme.palette.background.default,
      position: 'relative'
    }}>
      {/* Header with New Conversation Button and History */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        px: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Button
          variant="outlined"
          onClick={handleNewConversation}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              bgcolor: theme.palette.primary.light + '20',
            },
          }}
        >
          New Conversation
        </Button>
        
        <Tooltip title="Conversation history">
        <IconButton
          onClick={handleHistoryClick}
          sx={{
            bgcolor: theme.palette.action.hover,
            '&:hover': {
              bgcolor: theme.palette.action.selected,
            },
          }}
        >
          <History />
        </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={historyAnchorEl}
          open={Boolean(historyAnchorEl)}
          onClose={handleHistoryClose}
          PaperProps={{
            sx: {
              minWidth: 300,
              maxHeight: 400,
              overflow: 'auto',
            },
          }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2" fontWeight={600}>
              Recent Conversations ({conversations.length})
            </Typography>
          </MenuItem>
          <Divider />
          {conversations.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="textSecondary">
                No recent conversations
              </Typography>
            </MenuItem>
          ) : (
            conversations.map((conversation) => (
              <MenuItem 
                key={conversation.id} 
                onClick={() => handleSelectConversation(conversation)}
                selected={currentConversation?.id === conversation.id}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                    {conversation.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(conversation.createdAt)}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
          pt: 0,
        display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.background.default
      }}>
        {/* Chat History */}
          <Box sx={{ flex: 1, overflow: 'auto', mb: 1, position: 'relative', bgcolor: theme.palette.background.default, pt: 10 }}>
          {(!currentConversation && !loading) ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <AutoAwesome sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Start a conversation
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Describe what you need, and I'll help you manage it
              </Typography>
            </Box>
          ) : (
            currentConversation ? (
            currentConversation.messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
            ) : null
          )}

          {/* Current Turn (while loading): user message then spacer then assistant dots */}
          {loading && command && (
            <Box sx={{ mb: 3 }}>
              {/* User Command - Right Side (top of turn) */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, justifyContent: 'flex-end' }}>
                <Paper sx={{ p: 2, maxWidth: '70%', bgcolor: 'primary.50', textAlign: 'left' }}>
                  <Typography variant="body2" fontWeight={500}>
                    {command}
                  </Typography>
                </Paper>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, ml: 2, mt: 0.5 }}>
                  <Assignment />
                </Avatar>
              </Box>
              {/* Assistant thinking indicator aligned at AI start position */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 40 }}>
                {/* Invisible avatar spacer to align with AI avatar position */}
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2, mt: 0.5, opacity: 0 }}>
                  <SmartToy />
                </Avatar>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  p: 0.5,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  width: 'fit-content'
                }}
                ref={messagesEndRef}
              >
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, animation: 'pulse 1.5s ease-in-out infinite', '@keyframes pulse': { '0%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(1.2)' }, '100%': { opacity: 1, transform: 'scale(1)' } } }} />
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, animation: 'pulse 1.5s ease-in-out infinite 0.2s', '@keyframes pulse': { '0%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(1.2)' }, '100%': { opacity: 1, transform: 'scale(1)' } } }} />
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.primary.main, animation: 'pulse 1.5s ease-in-out infinite 0.4s', '@keyframes pulse': { '0%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(1.2)' }, '100%': { opacity: 1, transform: 'scale(1)' } } }} />
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Loading Animation moved into current turn above */}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ 
          width: '70%',
          mx: 'auto',
          bgcolor: theme.palette.background.paper,
          borderRadius: 5,
          p: 0.5,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'light' ? '0 2px 8px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept="*/*"
              />
              <Tooltip title="Attach file">
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    ml: 1,
                    mr: -1,
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                >
                  <AttachFile fontSize="small" />
                </IconButton>
              </Tooltip>
                
            <TextField
                inputRef={inputRef}
              fullWidth
              multiline
                minRows={1}
                maxRows={3}
              placeholder="Ask anything or type a task..."
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: 'transparent',
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            
              <Tooltip title={isRecording ? "Stop recording" : "Start voice recording"}>
              <IconButton
                color="inherit"
                size="small"
                  onClick={handleVoiceClick}
                sx={{
                    mr: 1,
                    color: isRecording ? theme.palette.error.main : theme.palette.text.secondary,
                    bgcolor: isRecording ? theme.palette.error.light + '20' : 'transparent',
                  '&:hover': {
                      bgcolor: isRecording ? theme.palette.error.light + '30' : theme.palette.action.hover,
                  },
                }}
              >
                <Mic fontSize="small" />
              </IconButton>
              </Tooltip>
              
              <Tooltip title="Send">
              <IconButton
                onClick={handleSubmit}
                disabled={!command.trim() || loading}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                    borderRadius: '50%',
                    width: 36,
                  height: 36,
                    mr: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                    '&.Mui-disabled': {
                    bgcolor: theme.palette.action.disabled,
                      color: theme.palette.action.disabledBackground,
                  },
                }}
              >
                  <ArrowUpward fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    
  );
};

export default Assistant; 