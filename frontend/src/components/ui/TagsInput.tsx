import React, { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface TagsInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  limit?: number;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
}

const TagsInput: React.FC<TagsInputProps> = ({
  value = [],
  onChange,
  placeholder = "Type and press Enter to add tags...",
  limit = 10,
  label = "Type and press Enter to add tags...",
  fullWidth = true,
  margin = 'dense',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!limit || value.length < limit) {
        const newTags = [...value, inputValue.trim()];
        setInputValue('');
        onChange?.(newTags);
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange?.(newTags);
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        fullWidth={fullWidth}
        margin={margin}
        variant="outlined"
        helperText={ `${value.length}/${limit} tags`}
        disabled={limit ? value.length >= limit : false}
      />
      {value.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 0.5,
          mt: 1
        }}>
          {value.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              onDelete={() => removeTag(index)}
              deleteIcon={<Close />}
                             sx={{ 
                 fontSize: '0.75rem',
                 height: 24,
                 fontWeight: 500,
                 borderWidth: 1,
                 borderColor: 'grey.300',
                 color: 'text.secondary',
                 backgroundColor: 'transparent',
                 '&:hover': {
                   backgroundColor: 'rgba(0, 0, 0, 0.04)'
                 },
                '& .MuiChip-deleteIcon': {
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main'
                  }
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TagsInput;
