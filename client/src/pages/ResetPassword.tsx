import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetMutation = useMutation({
    mutationFn: async (data: { username: string; recoveryKey: string; newPassword: string }) => {
      const response = await apiRequest("POST", "/auth/reset-password", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setLocation("/login");
        }, 3000);
      } else {
        setError(data.message || "Password reset failed");
      }
    },
    onError: (error: any) => {
      setError(error.message || "Password reset failed");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    resetMutation.mutate({ username, recoveryKey, newPassword });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              Password Reset Successful!
            </CardTitle>
            <CardDescription className="text-center">
              Your password has been updated. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription className="text-center">
                You can now sign in with your new password.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Link 
                href="/login" 
                className="text-primary hover:underline"
                data-testid="link-login-now"
              >
                Go to login page now
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Use your recovery key to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-1">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
                data-testid="input-reset-username"
              />
            </div>
            <div>
              <Label htmlFor="recoveryKey" className="block text-sm font-medium text-muted-foreground mb-1">
                Recovery Key
              </Label>
              <Input
                id="recoveryKey"
                type="text"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                className="w-full font-mono text-sm"
                placeholder="Enter your recovery key"
                required
                data-testid="input-recovery-key"
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                  data-testid="input-new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  data-testid="button-toggle-new-password"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                  data-testid="input-confirm-new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-testid="button-toggle-confirm-new-password"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={resetMutation.isPending}
              data-testid="button-reset-password"
            >
              {resetMutation.isPending ? "Resetting password..." : "Reset Password"}
            </Button>
          </form>
          
          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription data-testid="text-reset-error">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link 
                href="/login" 
                className="text-primary hover:underline font-medium"
                data-testid="link-back-to-login"
              >
                Back to login
              </Link>
            </p>
          </div>

          <Alert className="mt-4">
            <AlertDescription className="text-xs">
              <strong>Note:</strong> Your recovery key was provided when you created your account. 
              If you don't have it, you'll need to create a new account.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}