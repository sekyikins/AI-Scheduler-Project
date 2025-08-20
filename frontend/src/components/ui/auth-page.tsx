import { useState } from "react";
import { Button } from "./button";
import { SignUpDialog } from "./signup-dialog";
import { SignInDialog } from "./signin-dialog";
import { TermsDialog } from "./terms-dialog";
import { FAQDialog } from "./faq-dialog";
import { useTheme } from "../../contexts/ThemeContext";
import { DarkMode, LightMode } from "@mui/icons-material";

function AuthPage() {
  const [currentDialog, setCurrentDialog] = useState<'signin' | 'signup' | null>(null);
  const { mode, toggleTheme } = useTheme();

  const handleSwitchToSignUp = () => {
    setCurrentDialog('signup');
  };

  const handleSwitchToSignIn = () => {
    setCurrentDialog('signin');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme Toggle - Top Right Corner */}
      <div className="absolute z-10 top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
        >
          {mode === 'dark' ? <LightMode /> : <DarkMode />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        {/* Logo and Title */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <svg width="40" height="40" viewBox="0 0 32 32" className="stroke-white">
                <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
              </svg>
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            AI Scheduler
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Smart Task Management with AI
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          {currentDialog === 'signin' ? (
            <SignInDialog onSwitchToSignUp={handleSwitchToSignUp}>
              <Button className="w-full h-12 text-lg" variant="default">
                Sign In
              </Button>
            </SignInDialog>
          ) : currentDialog === 'signup' ? (
            <SignUpDialog onSwitchToSignIn={handleSwitchToSignIn}>
              <Button className="w-full h-12 text-lg" variant="default">
                Sign Up
              </Button>
            </SignUpDialog>
          ) : (
            <>
              <SignInDialog onSwitchToSignUp={handleSwitchToSignUp}>
                <Button className="w-full h-12 text-lg" variant="default">
                  Sign In
                </Button>
              </SignInDialog>
              
              <SignUpDialog onSwitchToSignIn={handleSwitchToSignIn}>
                <Button className="w-full h-12 text-lg" variant="outline">
                  Create Account
                </Button>
              </SignUpDialog>
            </>
          )}
        </div>

        {/* Additional Links */}
        <div className="mt-8 space-y-2 text-center">
          <TermsDialog>
            <Button variant="link" className="text-gray-600 dark:text-gray-400">
              Terms & Conditions
            </Button>
          </TermsDialog>
          
          <FAQDialog>
            <Button variant="link" className="text-gray-600 dark:text-gray-400">
              FAQ
            </Button>
          </FAQDialog>
        </div>

        {/* Features Preview */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 mt-16 md:grid-cols-3">
          <div className="p-6 text-center bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Smart Task Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered task organization and prioritization
            </p>
          </div>

          <div className="p-6 text-center bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg dark:bg-purple-900/30">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Productivity Boost</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pomodoro timer and focus tools
            </p>
          </div>

          <div className="p-6 text-center bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg dark:bg-green-900/30">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold">Progress Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visual insights and analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AuthPage };
