import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  // Check user authentication status
  const { data: authStatus } = useQuery({
    queryKey: ["/auth/status"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isAuthenticated = (authStatus as any)?.isAuthenticated;
  const user = (authStatus as any)?.user;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-xl text-foreground">MinimalAuth</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {location === "/" ? (
              <>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="nav-home"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="nav-how-it-works"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('apps')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="nav-apps"
                >
                  Apps
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="nav-about"
                >
                  About
                </button>
                <Link 
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="nav-blog"
                >
                  Blog
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="nav-home-link"
                >
                  Home
                </Link>
                <Link 
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="nav-about-link"
                >
                  About
                </Link>
                <Link 
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="nav-blog-link"
                >
                  Blog
                </Link>
              </>
            )}
            
            {/* User Authentication Section */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" data-testid="nav-dashboard">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.username || "Dashboard"}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" data-testid="nav-login">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" data-testid="nav-signup">
                    <Button size="sm" className="flex items-center gap-2">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </nav>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border" data-testid="menu-mobile">
            <div className="flex flex-col space-y-4">
              {location === "/" ? (
                <>
                  <button 
                    onClick={() => scrollToSection('home')}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    data-testid="nav-mobile-home"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    data-testid="nav-mobile-how-it-works"
                  >
                    How It Works
                  </button>
                  <button 
                    onClick={() => scrollToSection('apps')}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    data-testid="nav-mobile-apps"
                  >
                    Apps
                  </button>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    data-testid="nav-mobile-about"
                  >
                    About
                  </button>
                  <Link 
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    data-testid="nav-mobile-blog"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    data-testid="nav-mobile-home-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    data-testid="nav-mobile-about-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                    data-testid="nav-mobile-blog-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </>
              )}
              
              {/* Mobile Authentication Links */}
              <div className="border-t border-border pt-4 mt-4">
                {isAuthenticated ? (
                  <Link 
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground transition-colors text-left flex items-center gap-2"
                    data-testid="nav-mobile-dashboard"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    {user?.username || "Dashboard"}
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      href="/login"
                      className="text-muted-foreground hover:text-foreground transition-colors text-left flex items-center gap-2"
                      data-testid="nav-mobile-login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link 
                      href="/signup"
                      className="text-muted-foreground hover:text-foreground transition-colors text-left font-medium"
                      data-testid="nav-mobile-signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
