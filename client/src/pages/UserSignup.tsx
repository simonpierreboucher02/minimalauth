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
import { Copy, Download, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserSignup() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: async (userData: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/register", userData);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setRecoveryKey(data.recoveryKey);
        setShowRecoveryKey(true);
      } else {
        setError(data.message || "Signup failed");
      }
    },
    onError: (error: any) => {
      setError(error.message || "Signup failed");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    signupMutation.mutate({ username, password });
  };

  const copyRecoveryKey = () => {
    if (recoveryKey) {
      navigator.clipboard.writeText(recoveryKey);
      toast({
        title: "Recovery key copied",
        description: "Your recovery key has been copied to the clipboard.",
      });
    }
  };

  const downloadRecoveryKey = () => {
    if (recoveryKey) {
      const blob = new Blob([`MinimalAuth Recovery Key for ${username}\n\nRecovery Key: ${recoveryKey}\n\nKeep this key safe! You'll need it to reset your password if you forget it.\nDate: ${new Date().toLocaleDateString()}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `minimalauth-recovery-key-${username}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Recovery key downloaded",
        description: "Your recovery key has been saved as a text file.",
      });
    }
  };

  const proceedToDashboard = () => {
    setLocation("/dashboard");
  };

  if (showRecoveryKey && recoveryKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              Account Created Successfully!
            </CardTitle>
            <CardDescription className="text-center">
              Save your recovery key - you'll need it to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>
                <strong>Important:</strong> This recovery key will only be shown once. Save it securely!
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-muted-foreground mb-2">
                  Your Recovery Key
                </Label>
                <div className="relative">
                  <Input
                    value={recoveryKey}
                    readOnly
                    className="font-mono text-xs pr-20"
                    data-testid="text-recovery-key"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={copyRecoveryKey}
                      data-testid="button-copy-recovery-key"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={downloadRecoveryKey}
                      data-testid="button-download-recovery-key"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Keep this key in a safe place</p>
                <p>• You'll need it to reset your password</p>
                <p>• MinimalAuth cannot recover your account without it</p>
              </div>

              <Button
                onClick={proceedToDashboard}
                className="w-full"
                data-testid="button-proceed-to-dashboard"
              >
                I've Saved My Recovery Key - Continue
              </Button>
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
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join MinimalAuth - No email required
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
                data-testid="input-signup-username"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                  data-testid="input-signup-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                  data-testid="input-confirm-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-testid="button-toggle-confirm-password"
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
              disabled={signupMutation.isPending}
              data-testid="button-signup"
            >
              {signupMutation.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          
          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription data-testid="text-signup-error">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-primary hover:underline font-medium"
                data-testid="link-login"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}