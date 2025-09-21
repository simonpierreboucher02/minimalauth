import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@shared/schema";
import { Calendar, Clock, ArrowRight, Home } from "lucide-react";
import { format } from "date-fns";

export default function Blog() {
  // Get published blog posts
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading blog posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Button asChild variant="ghost" className="mb-8" data-testid="button-back-home-error">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Unable to Load Blog</h1>
              <p className="text-muted-foreground mb-6">
                We're having trouble loading the blog posts right now. Please try again later.
              </p>
              <Button asChild data-testid="button-try-again">
                <Link href="/blog">Try Again</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Button asChild variant="ghost" className="mb-6" data-testid="button-back-home">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              MinimalAuth Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights on privacy, security, and minimal authentication approaches for modern applications.
            </p>
          </div>

          {/* Blog Posts */}
          {posts && posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow" data-testid={`blog-post-${post.id}`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col space-y-4">
                      {/* Post Header */}
                      <div className="space-y-3">
                        <h2 className="text-2xl font-semibold text-foreground hover:text-primary transition-colors">
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="block"
                            data-testid={`link-blog-post-${post.slug}`}
                          >
                            {post.title}
                          </Link>
                        </h2>
                        
                        {/* Meta Information */}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {post.publishedAt && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span data-testid={`text-publish-date-${post.id}`}>
                                {format(new Date(post.publishedAt), "MMM dd, yyyy")}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>5 min read</span>
                          </div>
                        </div>
                      </div>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-muted-foreground text-lg leading-relaxed" data-testid={`text-excerpt-${post.id}`}>
                          {post.excerpt}
                        </p>
                      )}

                      {/* Read More Button */}
                      <div className="pt-4">
                        <Button asChild variant="outline" className="group" data-testid={`button-read-more-${post.id}`}>
                          <Link href={`/blog/${post.slug}`}>
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Blog Posts Yet</h3>
                <p className="text-muted-foreground">
                  We're working on creating valuable content about privacy and minimal authentication. 
                  Check back soon!
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-16 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Stay updated with the latest insights on privacy-first authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}