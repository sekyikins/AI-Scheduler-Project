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

interface SignUpDialogProps {
  onSwitchToSignIn: () => void;
  children: React.ReactNode;
}

function SignUpDialog({ onSwitchToSignIn, children }: SignUpDialogProps) {
  const id = useId();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col items-center flex-1 gap-2">
            <div
              className="flex items-center justify-center border rounded-full size-11 shrink-0 border-border bg-gradient-to-br from-blue-500 to-purple-600"
              aria-hidden="true"
            >
              <svg
                className="stroke-white"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">Sign up AI Scheduler</DialogTitle>
              <DialogDescription className="sm:text-center">
                We just need a few details to get you started.
              </DialogDescription>
            </DialogHeader>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSwitchToSignIn}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign in instead
          </Button>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-name`}>Full name</Label>
              <Input id={`${id}-name`} placeholder="Matt Welsh" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                required
              />
            </div>
          </div>
          <Button type="button" className="w-full">
            Sign up
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button variant="outline" className="w-full">
          Continue with Google
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By signing up you agree to our{" "}
          <button className="underline hover:no-underline text-inherit">
            Terms
          </button>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}

export { SignUpDialog };
