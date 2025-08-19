import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Calendar: React.FC = () => {

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          This feature will include:
        </Typography>
        <ul>
          <li>Monthly and weekly calendar views</li>
          <li>Task scheduling and deadline visualization</li>
          <li>Google Calendar integration</li>
          <li>Drag and drop task management</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Calendar; 