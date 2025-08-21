import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
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
import { GoogleEmailDialog } from "./google-email-dialog";
import { useTheme } from "../../contexts/ThemeContext";
import { Box, Typography, useTheme as useMuiTheme } from "@mui/material";

interface SignInDialogProps {
  onSwitchToSignUp: () => void;
  children: React.ReactNode;
}

function SignInDialog({ onSwitchToSignUp, children }: SignInDialogProps) {
  const id = useId();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Use the actual authentication function from AuthContext
      await login(email, password);
      
      // If login is successful, navigate to dashboard
      navigate('/');
      
    } catch (error: any) {
      console.error('Sign in failed:', error);
      setError(error.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
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
              <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
              <DialogDescription className="sm:text-center">
                Enter your credentials to login to your account.
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
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input 
                id={`${id}-email`} 
                placeholder="hi@yourcompany.com" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                id={`${id}-remember`} 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor={`${id}-remember`} className="font-normal text-muted-foreground">
                Remember me
              </Label>
            </div>
            <button type="button" className="text-sm underline hover:no-underline text-inherit">
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          
          <GoogleEmailDialog>
            <Button variant="outline" className="flex-1">
              Email
            </Button>
          </GoogleEmailDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { SignInDialog };
