import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { App, InsertApp, BlogPost, InsertBlogPost, AppStats } from "@shared/schema";
import { Edit, Trash2, Plus, LogOut, BarChart3, TrendingUp, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IconPicker } from "@/components/IconPicker";
import { ColorPicker } from "@/components/ColorPicker";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [showAddBlogForm, setShowAddBlogForm] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [selectedAppStats, setSelectedAppStats] = useState<number | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string>("Link");
  const [selectedGradient, setSelectedGradient] = useState<string>("from-blue-500 to-blue-600");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check auth status
  const { data: authStatus, isLoading: authLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/status"],
  });

  useEffect(() => {
    if (!authLoading && !authStatus?.isAdmin) {
      setLocation("/admin");
    }
  }, [authStatus, authLoading, setLocation]);

  // Get apps
  const { data: apps, isLoading: appsLoading } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  // Get blog posts (admin)
  const { data: blogPosts, isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
  });

  // Get app stats if selected
  const { data: appStats } = useQuery<AppStats[]>({
    queryKey: ["/api/apps", selectedAppStats, "stats"],
    enabled: !!selectedAppStats,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout", {});
      return response.json();
    },
    onSuccess: () => {
      setLocation("/admin");
    }
  });

  // Create app mutation
  const createAppMutation = useMutation({
    mutationFn: async (appData: InsertApp) => {
      const response = await apiRequest("POST", "/api/apps", appData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "App created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create app",
        variant: "destructive",
      });
    }
  });

  // Update app mutation
  const updateAppMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertApp> }) => {
      const response = await apiRequest("PATCH", `/api/apps/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      setEditingApp(null);
      toast({
        title: "Success",
        description: "App updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update app",
        variant: "destructive",
      });
    }
  });

  // Delete app mutation
  const deleteAppMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/apps/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      toast({
        title: "Success",
        description: "App deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete app",
        variant: "destructive",
      });
    }
  });

  // Create blog post mutation
  const createBlogMutation = useMutation({
    mutationFn: async (postData: InsertBlogPost) => {
      const response = await apiRequest("POST", "/api/admin/blog", postData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setShowAddBlogForm(false);
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    }
  });

  // Update blog post mutation
  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBlogPost> }) => {
      const response = await apiRequest("PATCH", `/api/admin/blog/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setEditingBlogPost(null);
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    }
  });

  // Delete blog post mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/blog/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse JSON fields
    let specifications = null;
    let features = null;
    let images = null;
    
    try {
      const specsText = formData.get("specifications") as string;
      if (specsText && specsText.trim()) {
        specifications = JSON.stringify(specsText.split('\n').filter(s => s.trim()));
      }
    } catch (e) {
      // Keep null if parsing fails
    }
    
    try {
      const featuresText = formData.get("features") as string;
      if (featuresText && featuresText.trim()) {
        features = JSON.stringify(featuresText.split('\n').filter(f => f.trim()));
      }
    } catch (e) {
      // Keep null if parsing fails
    }
    
    try {
      const imagesText = formData.get("images") as string;
      if (imagesText && imagesText.trim()) {
        images = JSON.stringify(imagesText.split('\n').filter(i => i.trim()));
      }
    } catch (e) {
      // Keep null if parsing fails
    }

    const appData: InsertApp = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      url: formData.get("url") as string,
      icon: selectedIcon,
      gradient: selectedGradient,
      longDescription: formData.get("longDescription") as string || undefined,
      specifications,
      features,
      images,
      version: formData.get("version") as string || undefined,
      developer: formData.get("developer") as string || undefined,
      supportEmail: formData.get("supportEmail") as string || undefined,
      privacyPolicy: formData.get("privacyPolicy") as string || undefined,
      termsOfService: formData.get("termsOfService") as string || undefined,
    };

    if (editingApp) {
      updateAppMutation.mutate({ id: editingApp.id, data: appData });
    } else {
      createAppMutation.mutate(appData);
    }
  };

  // Reset form state when adding new app
  const handleAddApp = () => {
    setShowAddForm(true);
    setEditingApp(null);
    setSelectedIcon("Link");
    setSelectedGradient("from-blue-500 to-blue-600");
  };

  // Set form state when editing app
  const handleEditApp = (app: App) => {
    setEditingApp(app);
    setSelectedIcon(app.icon);
    setSelectedGradient(app.gradient);
  };

  const handleBlogSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const blogData: InsertBlogPost = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      slug: formData.get("slug") as string,
      published: formData.get("published") === "true",
    };

    if (editingBlogPost) {
      updateBlogMutation.mutate({ id: editingBlogPost.id, data: blogData });
    } else {
      createBlogMutation.mutate(blogData);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!authStatus?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <Button 
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="apps" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="apps">Apps Management</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            </TabsList>

            {/* Apps Management Tab */}
            <TabsContent value="apps" className="space-y-6">
              <div className="flex gap-4 mb-6">
                <Button 
                  onClick={handleAddApp}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-add-app"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add App
                </Button>
              </div>

          {/* Add/Edit App Form */}
          {(showAddForm || editingApp) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingApp ? "Edit App" : "Add New App"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">App Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingApp?.name || ""}
                        required
                        data-testid="input-app-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="url">App URL</Label>
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        defaultValue={editingApp?.url || ""}
                        required
                        data-testid="input-app-url"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <IconPicker
                      value={selectedIcon}
                      onValueChange={setSelectedIcon}
                    />
                    <ColorPicker
                      value={selectedGradient}
                      onValueChange={setSelectedGradient}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (courte)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      defaultValue={editingApp?.description || ""}
                      required
                      data-testid="textarea-app-description"
                    />
                  </div>
                  
                  {/* Section Détails de l'App */}
                  <div className="pt-6 border-t border-border">
                    <h4 className="text-lg font-semibold mb-4 text-foreground">Détails de l'Application</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="longDescription">Description longue</Label>
                        <Textarea
                          id="longDescription"
                          name="longDescription"
                          rows={4}
                          placeholder="Description détaillée de l'application..."
                          defaultValue={editingApp?.longDescription || ""}
                          data-testid="textarea-app-long-description"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="version">Version</Label>
                          <Input
                            id="version"
                            name="version"
                            placeholder="ex: 1.0.0"
                            defaultValue={editingApp?.version || ""}
                            data-testid="input-app-version"
                          />
                        </div>
                        <div>
                          <Label htmlFor="developer">Développeur</Label>
                          <Input
                            id="developer"
                            name="developer"
                            placeholder="Nom du développeur ou équipe"
                            defaultValue={editingApp?.developer || ""}
                            data-testid="input-app-developer"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="supportEmail">Email de support</Label>
                          <Input
                            id="supportEmail"
                            name="supportEmail"
                            type="email"
                            placeholder="support@example.com"
                            defaultValue={editingApp?.supportEmail || ""}
                            data-testid="input-app-support-email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="privacyPolicy">Politique de confidentialité (URL)</Label>
                          <Input
                            id="privacyPolicy"
                            name="privacyPolicy"
                            type="url"
                            placeholder="https://..."
                            defaultValue={editingApp?.privacyPolicy || ""}
                            data-testid="input-app-privacy-policy"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="termsOfService">Conditions d'utilisation (URL)</Label>
                        <Input
                          id="termsOfService"
                          name="termsOfService"
                          type="url"
                          placeholder="https://..."
                          defaultValue={editingApp?.termsOfService || ""}
                          data-testid="input-app-terms-of-service"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="specifications">Spécifications techniques</Label>
                        <Textarea
                          id="specifications"
                          name="specifications"
                          rows={4}
                          placeholder="Une spécification par ligne&#10;Support iOS et Android&#10;Base de données PostgreSQL&#10;API REST..."
                          defaultValue={editingApp?.specifications ? JSON.parse(editingApp.specifications).join('\n') : ""}
                          data-testid="textarea-app-specifications"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Une spécification par ligne</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="features">Fonctionnalités principales</Label>
                        <Textarea
                          id="features"
                          name="features"
                          rows={4}
                          placeholder="Une fonctionnalité par ligne&#10;Authentification sécurisée&#10;Interface intuitive&#10;Synchronisation temps réel..."
                          defaultValue={editingApp?.features ? JSON.parse(editingApp.features).join('\n') : ""}
                          data-testid="textarea-app-features"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Une fonctionnalité par ligne</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="images">Images de l'application</Label>
                        <Textarea
                          id="images"
                          name="images"
                          rows={3}
                          placeholder="Une URL d'image par ligne&#10;https://example.com/screenshot1.jpg&#10;https://example.com/screenshot2.jpg..."
                          defaultValue={editingApp?.images ? JSON.parse(editingApp.images).join('\n') : ""}
                          data-testid="textarea-app-images"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Une URL d'image par ligne</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={createAppMutation.isPending || updateAppMutation.isPending}
                      data-testid="button-save-app"
                    >
                      {editingApp ? "Update App" : "Add App"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingApp(null);
                      }}
                      data-testid="button-cancel-app"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Apps List */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Apps</CardTitle>
            </CardHeader>
            <CardContent>
              {appsLoading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading apps...</div>
                </div>
              ) : apps && apps.length > 0 ? (
                <div className="divide-y divide-border">
                  {apps.map((app) => (
                    <div key={app.id} className="py-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-card-foreground" data-testid={`text-app-name-${app.id}`}>
                          {app.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1" data-testid={`text-app-description-${app.id}`}>
                          {app.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          URL: {app.url}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditApp(app)}
                          data-testid={`button-edit-app-${app.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteAppMutation.mutate(app.id)}
                          disabled={deleteAppMutation.isPending}
                          className="text-destructive hover:text-destructive"
                          data-testid={`button-delete-app-${app.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">No apps found</div>
                </div>
              )}
            </CardContent>
          </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    App Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="app-select">Select App</Label>
                      <Select onValueChange={(value) => setSelectedAppStats(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an app to view statistics" />
                        </SelectTrigger>
                        <SelectContent>
                          {apps?.map((app) => (
                            <SelectItem key={app.id} value={app.id.toString()}>
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedAppStats && appStats && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Visit Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {appStats.slice(0, 7).map((stat, index) => (
                            <Card key={stat.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                  <Eye className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(stat.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="text-2xl font-bold mt-2">{stat.visits}</div>
                                <div className="text-sm text-muted-foreground">visits</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blog Posts Tab */}
            <TabsContent value="blog" className="space-y-6">
              <div className="flex gap-4 mb-6">
                <Button 
                  onClick={() => {
                    setShowAddBlogForm(true);
                    setEditingBlogPost(null);
                  }}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-add-blog-post"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </div>

              {/* Add/Edit Blog Post Form */}
              {(showAddBlogForm || editingBlogPost) && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingBlogPost ? "Edit Blog Post" : "Add New Blog Post"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="blog-title">Title</Label>
                          <Input
                            id="blog-title"
                            name="title"
                            defaultValue={editingBlogPost?.title || ""}
                            required
                            data-testid="input-blog-title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="blog-slug">Slug</Label>
                          <Input
                            id="blog-slug"
                            name="slug"
                            defaultValue={editingBlogPost?.slug || ""}
                            required
                            data-testid="input-blog-slug"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="blog-excerpt">Excerpt</Label>
                        <Textarea
                          id="blog-excerpt"
                          name="excerpt"
                          rows={2}
                          defaultValue={editingBlogPost?.excerpt || ""}
                          data-testid="textarea-blog-excerpt"
                        />
                      </div>
                      <div>
                        <Label htmlFor="blog-content">Content</Label>
                        <Textarea
                          id="blog-content"
                          name="content"
                          rows={8}
                          defaultValue={editingBlogPost?.content || ""}
                          required
                          data-testid="textarea-blog-content"
                        />
                      </div>
                      <div>
                        <Label htmlFor="blog-published">Status</Label>
                        <Select name="published" defaultValue={editingBlogPost?.published ? "true" : "false"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">Draft</SelectItem>
                            <SelectItem value="true">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
                          data-testid="button-save-blog-post"
                        >
                          {editingBlogPost ? "Update Post" : "Create Post"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAddBlogForm(false);
                            setEditingBlogPost(null);
                          }}
                          data-testid="button-cancel-blog-post"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Blog Posts List */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {blogLoading ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">Loading blog posts...</div>
                    </div>
                  ) : blogPosts && blogPosts.length > 0 ? (
                    <div className="divide-y divide-border">
                      {blogPosts.map((post) => (
                        <div key={post.id} className="py-4 flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-card-foreground" data-testid={`text-blog-title-${post.id}`}>
                                {post.title}
                              </h4>
                              <Badge variant={post.published ? "default" : "secondary"}>
                                {post.published ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1" data-testid={`text-blog-excerpt-${post.id}`}>
                              {post.excerpt || "No excerpt"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Created: {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingBlogPost(post)}
                              data-testid={`button-edit-blog-post-${post.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteBlogMutation.mutate(post.id)}
                              disabled={deleteBlogMutation.isPending}
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-blog-post-${post.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">No blog posts found</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
