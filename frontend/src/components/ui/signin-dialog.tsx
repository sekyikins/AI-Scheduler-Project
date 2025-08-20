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

interface SignInDialogProps {
  onSwitchToSignUp: () => void;
  children: React.ReactNode;
}

function SignInDialog({ onSwitchToSignUp, children }: SignInDialogProps) {
  const id = useId();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-gradient-to-br from-blue-500 to-purple-600"
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
              <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
              <DialogDescription className="sm:text-center">
                Enter your credentials to login to your account.
              </DialogDescription>
            </DialogHeader>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSwitchToSignUp}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Create new account
          </Button>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
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
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-remember`} />
              <Label htmlFor={`${id}-remember`} className="font-normal text-muted-foreground">
                Remember me
              </Label>
            </div>
            <button className="text-sm underline hover:no-underline text-inherit">
              Forgot password?
            </button>
          </div>
          <Button type="button" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export { SignInDialog };
