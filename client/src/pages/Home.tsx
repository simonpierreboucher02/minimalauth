import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { App } from "@shared/schema";

export default function Home() {
  const { data: apps, isLoading } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section id="home" className="py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                MinimalAuth — <span className="text-primary">Privacy Made Simple</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                Discover applications that let you sign up with only a <strong>username</strong>, <strong>password</strong>, and a <strong>one-time recovery key</strong>. Nothing else.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={() => scrollToSection('apps')}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 min-w-[160px]"
                  data-testid="button-explore-apps"
                >
                  Explore Apps
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection('how-it-works')}
                  className="border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors min-w-[160px]"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">How It Works</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our authentication model is designed for maximum privacy and simplicity
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">Create Username</h3>
                  <p className="text-muted-foreground">
                    Sign up with only a username and password. No email or phone number required.
                  </p>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">Save Recovery Key</h3>
                  <p className="text-muted-foreground">
                    A unique recovery key is generated and shown once. Save it securely.
                  </p>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">No Personal Data</h3>
                  <p className="text-muted-foreground">
                    We don't collect emails, phone numbers, or any personal information.
                  </p>
                </div>
                
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">Reset with Key</h3>
                  <p className="text-muted-foreground">
                    Password reset works only with your recovery key. Simple and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section id="apps" className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Applications in the Suite</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Each app in our suite follows the MinimalAuth principle for maximum privacy
                </p>
              </div>
              
              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-card rounded-xl p-8 shadow-sm border border-border">
                      <div className="animate-pulse">
                        <div className="w-14 h-14 bg-muted rounded-xl mb-4"></div>
                        <div className="h-6 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded mb-4"></div>
                        <div className="h-8 w-24 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {apps?.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">About Us</h2>
              <div className="bg-card rounded-xl p-8 lg:p-12 shadow-sm border border-border">
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
                  MinimalAuth is committed to a new way of thinking about authentication: <strong className="text-foreground">simple, minimal, and private</strong>. Our apps are built for people who want sovereignty over their digital identity — without giving away their email or phone number.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-center">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-medium text-foreground">No Email Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-medium text-foreground">No Phone Number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-medium text-foreground">Maximum Privacy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
