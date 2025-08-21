import { useState } from "react";
import { SignUpDialog } from "./signup-dialog";
import { SignInDialog } from "./signin-dialog";
import { TermsDialog } from "./terms-dialog";
import { FAQDialog } from "./faq-dialog";
import { useTheme } from "../../contexts/ThemeContext";
import { DarkMode, LightMode } from "@mui/icons-material";
import { Box, Typography, Button, useTheme as useMuiTheme } from "@mui/material";

function AuthPage() {
  const [currentDialog, setCurrentDialog] = useState<'signin' | 'signup' | null>(null);
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const handleSwitchToSignUp = () => {
    setCurrentDialog('signup');
  };

  const handleSwitchToSignIn = () => {
    setCurrentDialog('signin');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: muiTheme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)',
        position: 'relative'
      }}
    >
      {/* Theme Toggle - Top Right Corner */}
      <Box sx={{ position: 'absolute', zIndex: 10, top: 16, right: 16 }}>
        <Button
          variant="outlined"
          onClick={toggleTheme}
          sx={{
            borderRadius: '50%',
            minWidth: 40,
            width: 40,
            height: 40,
            boxShadow: 2,
            bgcolor: muiTheme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(31, 41, 55, 0.8)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              bgcolor: muiTheme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 1)' 
                : 'rgba(31, 41, 55, 1)',
            },
          }}
        >
          {mode === 'dark' ? <LightMode /> : <DarkMode />}
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1, 
        px: 2, 
        py: 4 
      }}>
        {/* Logo and Title */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              boxShadow: 8,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: 2,
            }}>
              <svg width="40" height="40" viewBox="0 0 32 32" style={{ stroke: 'white' }}>
                <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
              </svg>
            </Box>
          </Box>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 1, 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI Scheduler
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: muiTheme.palette.text.secondary,
            }}
          >
            Smart Task Management with AI
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ width: '100%', maxWidth: 384, mb: 4 }}>
          {currentDialog === 'signin' ? (
            <SignInDialog onSwitchToSignUp={handleSwitchToSignUp}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  width: '100%', 
                  height: 48, 
                  fontSize: '1.125rem',
                  mb: 2
                }}
              >
                Sign In
              </Button>
            </SignInDialog>
          ) : currentDialog === 'signup' ? (
            <SignUpDialog onSwitchToSignIn={handleSwitchToSignIn}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  width: '100%', 
                  height: 48, 
                  fontSize: '1.125rem',
                  mb: 2
                }}
              >
                Sign Up
              </Button>
            </SignUpDialog>
          ) : (
            <>
              <SignInDialog onSwitchToSignUp={handleSwitchToSignUp}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    width: '100%', 
                    height: 48, 
                    fontSize: '1.125rem',
                    mb: 2
                  }}
                >
                  Sign In
                </Button>
              </SignInDialog>
              
              <SignUpDialog onSwitchToSignIn={handleSwitchToSignIn}>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    width: '100%', 
                    height: 48, 
                    fontSize: '1.125rem'
                  }}
                >
                  Create Account
                </Button>
              </SignUpDialog>
            </>
          )}
        </Box>

        {/* Additional Links */}
        <Box sx={{ mv: 2, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TermsDialog>
              <Button 
                variant="text" 
                sx={{ 
                  color: muiTheme.palette.text.secondary,
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
              >
              Terms & Conditions
            </Button>
          </TermsDialog>
          
          <FAQDialog>
              <Button 
                variant="text" 
                sx={{ 
                  color: muiTheme.palette.text.secondary,
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
              >
              FAQ
            </Button>
          </FAQDialog>
          </Box>
        </Box>

        {/* Features Preview */}
        <Box sx={{ 
          display: 'grid', 
          width: '100%', 
          maxWidth: '64rem', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3, 
          mt: 8 
        }}>
          <Box sx={{ 
            p: 3, 
            textAlign: 'center', 
            bgcolor: muiTheme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.6)' 
              : 'rgba(31, 41, 55, 0.6)',
            borderRadius: 3,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${muiTheme.palette.divider}`,
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: muiTheme.palette.mode === 'light' 
                ? '0 20px 40px rgba(0, 0, 0, 0.1)' 
                : '0 20px 40px rgba(0, 0, 0, 0.3)',
              bgcolor: muiTheme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgba(31, 41, 55, 0.8)',
            }
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              mx: 'auto',
              mb: 2,
              bgcolor: muiTheme.palette.mode === 'light' 
                ? 'primary.50' 
                : 'primary.900',
              borderRadius: 2
            }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: muiTheme.palette.primary.main }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Smart Task Management
            </Typography>
            <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
              AI-powered task organization and prioritization
            </Typography>
          </Box>

          <Box sx={{ 
            p: 3, 
            textAlign: 'center', 
            bgcolor: muiTheme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.6)' 
              : 'rgba(31, 41, 55, 0.6)',
            borderRadius: 3,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${muiTheme.palette.divider}`,
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: muiTheme.palette.mode === 'light' 
                ? '0 20px 40px rgba(0, 0, 0, 0.1)' 
                : '0 20px 40px rgba(0, 0, 0, 0.3)',
              bgcolor: muiTheme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgba(31, 41, 55, 0.8)',
            }
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              mx: 'auto',
              mb: 2,
              bgcolor: muiTheme.palette.mode === 'light' 
                ? 'secondary.50' 
                : 'secondary.900',
              borderRadius: 2
            }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: muiTheme.palette.secondary.main }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Productivity Boost
            </Typography>
            <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
              Pomodoro timer and focus tools
            </Typography>
          </Box>

          <Box sx={{ 
            p: 3, 
            textAlign: 'center', 
            bgcolor: muiTheme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.6)' 
              : 'rgba(31, 41, 55, 0.6)',
            borderRadius: 3,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${muiTheme.palette.divider}`,
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: muiTheme.palette.mode === 'light' 
                ? '0 20px 40px rgba(0, 0, 0, 0.1)' 
                : '0 20px 40px rgba(0, 0, 0, 0.3)',
              bgcolor: muiTheme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgba(31, 41, 55, 0.8)',
            }
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              mx: 'auto',
              mb: 2,
              bgcolor: muiTheme.palette.mode === 'light' 
                ? 'success.50' 
                : 'success.900',
              borderRadius: 2
            }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: muiTheme.palette.success.main }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Progress Tracking
            </Typography>
            <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary }}>
              Visual insights and analytics
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export { AuthPage };
