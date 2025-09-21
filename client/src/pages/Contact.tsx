import { Link } from "wouter";
import { ArrowLeft, Mail, MessageSquare, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
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
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="contact-page-title">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're here to help with questions about MinimalAuth and our privacy-focused applications
            </p>
          </div>

          {/* Privacy Notice */}
          <section className="mb-12">
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Shield className="w-5 h-5" />
                  Privacy-First Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600 dark:text-blue-200">
                  In keeping with our privacy-first principles, we don't use contact forms that track or 
                  collect your data. Instead, we provide direct communication methods that respect your 
                  privacy and give you full control over what information you share.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact Methods */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Get In Touch</h2>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Email Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For general questions, technical support, or feedback about our applications.
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <code className="text-foreground font-mono">spbou4@protonmail.com</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Response time: 24-48 hours
                  </p>
                </CardContent>
              </Card>

              {/* Security Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For reporting security vulnerabilities or privacy concerns.
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <code className="text-foreground font-mono">spbou4@protonmail.com</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Response time: 12-24 hours
                  </p>
                </CardContent>
              </Card>

              {/* Community Discussions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Community Forum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Join discussions about privacy, authentication, and our applications.
                  </p>
                  <Button variant="outline" className="w-full" data-testid="button-visit-forum">
                    Visit ForumLite Community
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect with other privacy-conscious users
                  </p>
                </CardContent>
              </Card>

              {/* Business Inquiries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Business Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    For partnerships, integrations, or enterprise solutions.
                  </p>
                  <div className="bg-muted p-3 rounded-md">
                    <code className="text-foreground font-mono">spbou4@protonmail.com</code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Response time: 48-72 hours
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I recover my account if I lose my password and recovery key?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Unfortunately, if you lose both your password and recovery key, account recovery is not possible. 
                    This is by design—it ensures that we cannot access your account even if we wanted to. We strongly 
                    recommend storing your recovery key in a secure location like a password manager.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change my username after creating an account?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Currently, usernames cannot be changed after account creation. This limitation helps maintain 
                    system integrity and prevents potential abuse. If you need a different username, you'll need 
                    to create a new account.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is MinimalAuth suitable for enterprise use?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    MinimalAuth can be adapted for enterprise environments that prioritize privacy and minimal 
                    data collection. Contact us at business@minimalauth.dev to discuss custom solutions and 
                    integration requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I delete my account and data?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Account deletion options are available within each application's settings. When you delete 
                    your account, all associated data is permanently removed from our systems within 30 days, 
                    in accordance with our Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do you offer API access for developers?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We're currently developing developer-friendly APIs that maintain our privacy standards. 
                    If you're interested in integrating MinimalAuth into your application, please contact 
                    us at spbou4@protonmail.com for early access information.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Response Time Notice */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We aim to respond to all inquiries promptly while maintaining quality support:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Security Issues:</strong> 12-24 hours</li>
                  <li><strong>Technical Support:</strong> 24-48 hours</li>
                  <li><strong>General Questions:</strong> 24-48 hours</li>
                  <li><strong>Business Inquiries:</strong> 48-72 hours</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Response times may be longer during weekends and holidays. For urgent security 
                  issues, please clearly mark your email as "URGENT SECURITY" in the subject line.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Alternative Resources */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Additional Resources</h2>
            <p className="text-muted-foreground mb-6">
              Before contacting us, you might find answers in our documentation and policies.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/privacy">
                <Button variant="outline" data-testid="button-privacy-policy">
                  Privacy Policy
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="outline" data-testid="button-terms-service">
                  Terms of Service
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" data-testid="button-about-page">
                  About MinimalAuth
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}