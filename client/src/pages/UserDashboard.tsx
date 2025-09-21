import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogOut, Settings, Plus, Eye, EyeOff, Edit2, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { App, UserAppCredential } from "@shared/schema";

interface User {
  id: string;
  username: string;
  createdAt: string;
}

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [showAddCredentialDialog, setShowAddCredentialDialog] = useState(false);
  const [editingCredential, setEditingCredential] = useState<UserAppCredential | null>(null);
  const [credentialForm, setCredentialForm] = useState({
    appUsername: "",
    appPassword: "",
    notes: ""
  });
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  // Check authentication status
  const { data: user, isLoading: authLoading, error: authError } = useQuery<User>({
    queryKey: ["/api/user"],
    retry: false
  });

  // Handle authentication redirect with useEffect
  useEffect(() => {
    if (!authLoading && (authError || !user)) {
      setLocation("/login");
    }
  }, [authLoading, authError, user, setLocation]);

  // Get all apps
  const { data: apps = [], isLoading: appsLoading } = useQuery({
    queryKey: ["/api/apps"]
  });

  // Get user's app credentials
  const { data: credentials = [], isLoading: credentialsLoading } = useQuery({
    queryKey: ["/api/user/credentials"],
    enabled: !!user
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/login");
    }
  });

  const deleteCredentialMutation = useMutation({
    mutationFn: async (credentialId: number) => {
      const response = await apiRequest("DELETE", `/api/user/credentials/${credentialId}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/credentials"] });
      toast({
        title: "Credential deleted",
        description: "App credential has been removed from your account.",
      });
    }
  });

  const saveCredentialMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingCredential) {
        const response = await apiRequest("PATCH", `/api/user/credentials/${editingCredential.id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/user/credentials", data);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/credentials"] });
      setShowAddCredentialDialog(false);
      setEditingCredential(null);
      setCredentialForm({ appUsername: "", appPassword: "", notes: "" });
      toast({
        title: editingCredential ? "Credential updated" : "Credential saved",
        description: `App credential has been ${editingCredential ? "updated" : "added to"} your account.`,
      });
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleAddCredential = (app: App) => {
    setSelectedApp(app);
    setCredentialForm({ appUsername: "", appPassword: "", notes: "" });
    setEditingCredential(null);
    setShowAddCredentialDialog(true);
  };

  const handleEditCredential = (credential: UserAppCredential) => {
    const app = (apps as App[]).find((a: App) => a.id === credential.appId);
    if (app) {
      setSelectedApp(app);
      setCredentialForm({
        appUsername: credential.appUsername,
        appPassword: credential.appPassword,
        notes: credential.notes || ""
      });
      setEditingCredential(credential);
      setShowAddCredentialDialog(true);
    }
  };

  const handleSaveCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    saveCredentialMutation.mutate({
      appId: selectedApp.id,
      ...credentialForm
    });
  };

  const togglePasswordVisibility = (credentialId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const getCredentialForApp = (appId: number) => {
    return (credentials as UserAppCredential[]).find((cred: UserAppCredential) => cred.appId === appId);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-primary" data-testid="link-home">
              MinimalAuth
            </Link>
            <Badge variant="secondary">Dashboard</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, <strong data-testid="text-username">{user.username}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="apps" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="apps" data-testid="tab-apps">My Apps</TabsTrigger>
            <TabsTrigger value="account" data-testid="tab-account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="apps" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Apps</h1>
                <p className="text-muted-foreground">
                  Manage your credentials for MinimalAuth apps
                </p>
              </div>
            </div>

            {appsLoading || credentialsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(apps as App[]).map((app: App) => {
                  const credential = getCredentialForApp(app.id);
                  return (
                    <Card key={app.id} className="relative" data-testid={`card-app-${app.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                              style={{ background: app.gradient }}
                            >
                              {app.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{app.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {credential ? "Credentials saved" : "No credentials"}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={credential ? "default" : "secondary"}>
                            {credential ? "Connected" : "Available"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {app.description}
                        </p>
                        
                        {credential ? (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">Username</Label>
                              <div className="flex items-center gap-2">
                                <code className="text-sm bg-muted px-2 py-1 rounded flex-1" data-testid={`text-credential-username-${app.id}`}>
                                  {credential.appUsername}
                                </code>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Password</Label>
                              <div className="flex items-center gap-2">
                                <code className="text-sm bg-muted px-2 py-1 rounded flex-1" data-testid={`text-credential-password-${app.id}`}>
                                  {showPasswords[credential.id] ? credential.appPassword : "••••••••"}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => togglePasswordVisibility(credential.id)}
                                  data-testid={`button-toggle-password-${app.id}`}
                                >
                                  {showPasswords[credential.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </Button>
                              </div>
                            </div>
                            {credential.notes && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Notes</Label>
                                <p className="text-sm" data-testid={`text-credential-notes-${app.id}`}>{credential.notes}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCredential(credential)}
                                data-testid={`button-edit-credential-${app.id}`}
                              >
                                <Edit2 className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteCredentialMutation.mutate(credential.id)}
                                disabled={deleteCredentialMutation.isPending}
                                data-testid={`button-delete-credential-${app.id}`}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                data-testid={`button-visit-app-${app.id}`}
                              >
                                <a href={app.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Visit
                                </a>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                              Save your credentials for quick access to {app.name}.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAddCredential(app)}
                                size="sm"
                                data-testid={`button-add-credential-${app.id}`}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Credentials
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                data-testid={`button-visit-app-${app.id}`}
                              >
                                <a href={app.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Visit
                                </a>
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {(apps as App[]).length === 0 && !appsLoading && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No apps available yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-muted-foreground">
                Manage your MinimalAuth account
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your basic account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Username</Label>
                    <p className="font-medium" data-testid="text-account-username">{user.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Member Since</Label>
                    <p className="font-medium" data-testid="text-account-created">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Saved Apps</Label>
                    <p className="font-medium" data-testid="text-account-apps-count">
                      {(credentials as UserAppCredential[]).length} app{(credentials as UserAppCredential[]).length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertDescription>
                      <strong>Recovery Key:</strong> Keep your recovery key safe. It's the only way to reset your password if you forget it.
                      MinimalAuth cannot recover your account without it.
                    </AlertDescription>
                  </Alert>
                  <div className="mt-4">
                    <Button variant="outline" asChild data-testid="button-reset-password">
                      <Link href="/reset-password">
                        <Settings className="h-4 w-4 mr-2" />
                        Reset Password
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Credential Dialog */}
      <Dialog open={showAddCredentialDialog} onOpenChange={setShowAddCredentialDialog}>
        <DialogContent data-testid="dialog-credential">
          <DialogHeader>
            <DialogTitle>
              {editingCredential ? "Edit" : "Add"} Credentials for {selectedApp?.name}
            </DialogTitle>
            <DialogDescription>
              {editingCredential ? "Update your" : "Save your"} login credentials for quick access to {selectedApp?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveCredential} className="space-y-4">
            <div>
              <Label htmlFor="appUsername">Username</Label>
              <Input
                id="appUsername"
                type="text"
                value={credentialForm.appUsername}
                onChange={(e) => setCredentialForm(prev => ({ ...prev, appUsername: e.target.value }))}
                required
                data-testid="input-credential-username"
              />
            </div>
            <div>
              <Label htmlFor="appPassword">Password</Label>
              <Input
                id="appPassword"
                type="password"
                value={credentialForm.appPassword}
                onChange={(e) => setCredentialForm(prev => ({ ...prev, appPassword: e.target.value }))}
                required
                data-testid="input-credential-password"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                type="text"
                value={credentialForm.notes}
                onChange={(e) => setCredentialForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
                data-testid="input-credential-notes"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddCredentialDialog(false)}
                data-testid="button-cancel-credential"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveCredentialMutation.isPending}
                data-testid="button-save-credential"
              >
                {saveCredentialMutation.isPending ? "Saving..." : (editingCredential ? "Update" : "Save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}