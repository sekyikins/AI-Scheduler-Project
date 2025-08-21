import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { useId } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { OTPDialog } from "./otp-dialog";
import { useTheme } from "../../contexts/ThemeContext";
import { Box, Typography, useTheme as useMuiTheme } from "@mui/material";

interface GoogleEmailDialogProps {
  children: React.ReactNode;
}

function GoogleEmailDialog({ children }: GoogleEmailDialogProps) {
  const id = useId();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate sending OTP to Google email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show OTP dialog
      setShowOTP(true);
      
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setShowOTP(false);
    setError('');
  };

  const handleClose = () => {
    setShowOTP(false);
    setEmail('');
    setError('');
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: 8,
                mb: 1
              }}
              aria-hidden="true"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 32 32"
                style={{ stroke: 'white', strokeWidth: 8, fill: 'none' }}
              >
                <circle cx="16" cy="16" r="12" />
              </svg>
            </Box>
            <DialogHeader>
              <DialogTitle className="sm:text-center">Continue with Google</DialogTitle>
              <DialogDescription className="sm:text-center">
                Enter your Google email to receive a verification code
              </DialogDescription>
            </DialogHeader>
          </Box>
        </Box>

          <form onSubmit={handleEmailSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-googleEmail`}>Google Email</Label>
                <Input 
                  id={`${id}-googleEmail`} 
                  placeholder="your.email@gmail.com" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="text-center space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {showOTP && (
        <OTPDialog 
          onBack={handleBackToEmail} 
          open={showOTP} 
          onClose={handleClose}
          googleEmail={email}
        >
          <div className="hidden">OTP Trigger</div>
        </OTPDialog>
      )}
    </>
  );
}

export { GoogleEmailDialog }; 