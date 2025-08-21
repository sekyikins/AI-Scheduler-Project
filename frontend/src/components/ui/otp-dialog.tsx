import { useState, useRef, useEffect } from "react";
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
import { useTheme } from "../../contexts/ThemeContext";
import { Box, Typography, useTheme as useMuiTheme } from "@mui/material";

interface OTPDialogProps {
  children: React.ReactNode;
  onBack: () => void;
  open: boolean;
  onClose: () => void;
  googleEmail?: string;
}

function OTPDialog({ children, onBack, open, onClose, googleEmail }: OTPDialogProps) {
  const id = useId();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate OTP verification for Google auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit OTP
      if (otpString.length === 6) {
        // Simulate successful Google authentication
        // In a real app, you'd verify the OTP with Google's API
        const email = googleEmail || 'google-user@example.com';
        await login(email, 'google-auth-token');
        navigate('/');
      } else {
        throw new Error('Invalid OTP');
      }
      
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      setError(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = () => {
    setTimeLeft(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
              <DialogTitle className="sm:text-center">Verify OTP</DialogTitle>
              <DialogDescription className="sm:text-center">
                We've sent a 6-digit code to your Google account
              </DialogDescription>
            </DialogHeader>
          </Box>
        </Box>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enter 6-digit OTP</Label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    required
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            
            <div className="flex justify-center gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                disabled={isLoading}
              >
                Back
              </Button>
              
                             <Button 
                 type="button" 
                 variant="outline" 
                 onClick={resendOTP}
                 disabled={timeLeft > 0 || isLoading}
                 className="text-sm"
               >
                 {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend OTP'}
               </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { OTPDialog }; 