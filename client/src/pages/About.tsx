import { Link } from "wouter";
import { ArrowLeft, Shield, User, Key, Lock, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back to Home Button */}
          <div className="mb-8">
            <Button variant="outline" className="flex items-center gap-2" data-testid="button-back-home" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="about-page-title">
              About MinimalAuth
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Redefining authentication for the privacy-conscious web
            </p>
          </div>

          {/* Mission Statement */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  MinimalAuth was born from a simple belief: authentication shouldn't require surrendering 
                  your privacy. In a world where every service demands your email, phone number, and personal 
                  details, we offer a refreshing alternative—secure authentication with just a username, 
                  password, and recovery key.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* The Problem */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">The Problem with Traditional Auth</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Data Collection Overreach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Traditional authentication systems collect far more data than necessary—emails for 
                    marketing, phone numbers for tracking, and personal details for profiling.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Privacy Erosion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your authentication data becomes a gateway for targeted advertising, data brokers, 
                    and unwanted communications that persist long after you've forgotten about the service.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Security Vulnerabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Email-based recovery systems create additional attack vectors and dependency on 
                    third-party email providers who may also be compromised.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">User Friction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Multiple verification steps, email confirmations, and phone verifications create 
                    unnecessary barriers between users and the services they want to use.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Our Solution */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">The MinimalAuth Solution</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Username Only
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Choose any username you like. No email verification, no phone numbers, 
                    no personal information required.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Secure Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your password is your main authentication credential, securely hashed 
                    and never stored in plain text.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Recovery Key
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A cryptographically secure recovery key that you control completely. 
                    No external dependencies, no third-party access.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose MinimalAuth?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">True Privacy Protection</h3>
                  <p className="text-muted-foreground">
                    No tracking, no profiling, no data selling. Your identity remains yours alone.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Instant Access</h3>
                  <p className="text-muted-foreground">
                    No email verification delays, no waiting for SMS codes. Create an account and start using it immediately.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Self-Sovereign Recovery</h3>
                  <p className="text-muted-foreground">
                    Your recovery key puts you in complete control. No dependency on email providers or phone carriers.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Enhanced Security</h3>
                  <p className="text-muted-foreground">
                    Reduced attack surface with fewer data points to compromise. Strong cryptographic foundations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Developer Friendly</h3>
                  <p className="text-muted-foreground">
                    Simple integration for developers who want to respect their users' privacy without complexity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Applications */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Application Suite</h2>
            <p className="text-muted-foreground mb-6">
              MinimalAuth powers a growing ecosystem of privacy-focused applications, each designed 
              to provide essential functionality without compromising your personal data:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>LinkBoard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    A clean, efficient bookmark manager that organizes your links without tracking your browsing habits.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>NoteVault</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Secure note-taking with client-side encryption, ensuring your thoughts remain private.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>TaskFlow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Project management and task tracking that focuses on productivity, not surveillance.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>ForumLite</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Community discussions without user profiling or behavioral tracking algorithms.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Foundation */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Technical Foundation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Security-First Design</h3>
                  <p className="text-muted-foreground">
                    Built with modern cryptographic standards, including bcrypt password hashing, 
                    secure session management, and encrypted data storage.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Open Development</h3>
                  <p className="text-muted-foreground">
                    Our commitment to transparency includes open-source components and clear 
                    documentation of our security practices and data handling procedures.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Scalable Architecture</h3>
                  <p className="text-muted-foreground">
                    Modern web technologies ensure reliable performance while maintaining 
                    our core principles of privacy and simplicity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Join the Privacy Revolution</h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              Experience authentication as it should be—simple, secure, and respectful of your privacy. 
              Try our applications today and discover the freedom of minimal data collection.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-explore-apps">
                Explore Our Apps
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}