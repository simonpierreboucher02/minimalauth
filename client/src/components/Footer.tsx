import { Link, useLocation } from "wouter";

export default function Footer() {
  const [location] = useLocation();
  const isHomePage = location === "/";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-muted border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-xl text-foreground">MinimalAuth</span>
          </div>
          <p className="text-muted-foreground mb-6">Privacy-first authentication for the modern web</p>
          
          {/* Main Navigation */}
          <div className="flex justify-center space-x-6 mb-6">
            {isHomePage ? (
              <>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-home"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-how-it-works"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('apps')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-apps"
                >
                  Apps
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="footer-about"
                >
                  About
                </button>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-blog">
                  Blog
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-home">
                  Home
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-about-page">
                  About
                </Link>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-blog-page">
                  Blog
                </Link>
              </>
            )}
          </div>

          {/* Legal Links */}
          <div className="flex justify-center space-x-6 mb-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-terms">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-contact">
              Contact
            </Link>
          </div>
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2024 MinimalAuth. Built with privacy in mind.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
