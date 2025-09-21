import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@shared/schema";
import { Calendar, Clock, ArrowLeft, Home } from "lucide-react";
import { format } from "date-fns";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;

  // Get blog post by slug
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading blog post...</div>
      </div>
    );
  }

  if (error) {
    // Distinguish between network errors and 404
    const isNotFound = (error as any)?.message?.includes("404") || 
                       (error as any)?.status === 404 ||
                       (error as any)?.response?.status === 404;
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Button asChild variant="ghost" className="mb-8" data-testid="button-back-blog">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            
            <div className="max-w-md mx-auto">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isNotFound ? "bg-muted" : "bg-destructive/10"
              }`}>
                <Calendar className={`w-8 h-8 ${
                  isNotFound ? "text-muted-foreground" : "text-destructive"
                }`} />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {isNotFound ? "Blog Post Not Found" : "Unable to Load Post"}
              </h1>
              <p className="text-muted-foreground mb-6">
                {isNotFound 
                  ? "The blog post you're looking for doesn't exist or may have been removed."
                  : "We're having trouble loading this blog post right now. Please try again later."
                }
              </p>
              <Button asChild data-testid="button-back-to-blog">
                <Link href="/blog">Back to Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Button asChild variant="ghost" className="mb-8" data-testid="button-back-blog">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Blog Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The blog post you're looking for doesn't exist or may have been removed.
              </p>
              <Button asChild data-testid="button-back-to-blog">
                <Link href="/blog">Back to Blog</Link>
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
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Button asChild variant="ghost" data-testid="button-back-blog">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="sm" data-testid="button-home">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>

          {/* Article */}
          <article>
            <Card className="border-0 shadow-none bg-background">
              <CardContent className="p-0">
                {/* Article Header */}
                <header className="mb-8 text-center">
                  <h1 
                    className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
                    data-testid="text-blog-title"
                  >
                    {post.title}
                  </h1>
                  
                  {/* Meta Information */}
                  <div className="flex items-center justify-center space-x-6 text-muted-foreground">
                    {post.publishedAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span data-testid="text-publish-date">
                          {format(new Date(post.publishedAt), "MMMM dd, yyyy")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                  
                  {/* Excerpt */}
                  {post.excerpt && (
                    <p 
                      className="text-xl text-muted-foreground mt-6 leading-relaxed max-w-2xl mx-auto"
                      data-testid="text-blog-excerpt"
                    >
                      {post.excerpt}
                    </p>
                  )}
                </header>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-foreground leading-relaxed space-y-6"
                    data-testid="text-blog-content"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {post.content}
                  </div>
                </div>

                {/* Article Footer */}
                <footer className="mt-12 pt-8 border-t border-border">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      Published on {post.publishedAt ? format(new Date(post.publishedAt), "MMMM dd, yyyy") : "Unknown date"}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button asChild variant="outline" data-testid="button-back-to-blog-footer">
                        <Link href="/blog">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          More Articles
                        </Link>
                      </Button>
                      <Button asChild data-testid="button-home-footer">
                        <Link href="/">
                          <Home className="w-4 h-4 mr-2" />
                          Home
                        </Link>
                      </Button>
                    </div>
                  </div>
                </footer>
              </CardContent>
            </Card>
          </article>
        </div>
      </div>
    </div>
  );
}