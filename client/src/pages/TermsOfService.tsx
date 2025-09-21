import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="terms-of-service-title">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: September 18, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Welcome to MinimalAuth</h2>
              <p className="text-muted-foreground mb-4">
                These Terms of Service ("Terms") govern your use of the MinimalAuth platform and 
                applications (collectively, the "Service") provided by MinimalAuth ("we", "us", or "our").
              </p>
              <p className="text-muted-foreground mb-4">
                By accessing or using our Service, you agree to be bound by these Terms. If you 
                disagree with any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Account Registration</h2>
              <p className="text-muted-foreground mb-4">
                To use certain features of our Service, you must register for an account. When creating 
                an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Choose a unique username that doesn't infringe on others' rights</li>
                <li>Create a secure password and keep it confidential</li>
                <li>Safely store your recovery key and not share it with others</li>
                <li>Provide accurate information (where required by specific applications)</li>
                <li>Maintain the security of your account</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                You are responsible for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptable Use</h2>
              <p className="text-muted-foreground mb-4">
                When using our Service, you agree not to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Transmit any harmful, offensive, or illegal content</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Use the Service to spam, harass, or abuse other users</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated tools to access the Service without permission</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Privacy and Data</h2>
              <p className="text-muted-foreground mb-4">
                Your privacy is important to us. Our collection and use of personal information 
                is governed by our <Link href="/privacy" className="text-primary hover:underline" data-testid="link-privacy-inline">Privacy Policy</Link>, 
                which is incorporated into these Terms by reference.
              </p>
              <p className="text-muted-foreground mb-4">
                By using our Service, you acknowledge that you have read and understood our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Content and Intellectual Property</h2>
              <h3 className="text-xl font-medium text-foreground mb-3">Your Content</h3>
              <p className="text-muted-foreground mb-4">
                You retain ownership of any content you create or upload through our applications. 
                However, by using our Service, you grant us a non-exclusive, worldwide, royalty-free 
                license to use, store, and display your content as necessary to provide the Service.
              </p>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Our Content</h3>
              <p className="text-muted-foreground mb-4">
                The Service and its original content, features, and functionality are owned by 
                MinimalAuth and are protected by international copyright, trademark, and other 
                intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Service Availability</h2>
              <p className="text-muted-foreground mb-4">
                We strive to maintain high availability of our Service, but we do not guarantee 
                uninterrupted access. The Service may be temporarily unavailable due to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Scheduled maintenance</li>
                <li>Technical issues or outages</li>
                <li>Updates and improvements</li>
                <li>Circumstances beyond our control</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
              <p className="text-muted-foreground mb-4">
                Either party may terminate this agreement at any time:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>By You:</strong> You may delete your account at any time through the account settings</li>
                <li><strong>By Us:</strong> We may suspend or terminate accounts that violate these Terms</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Upon termination, your right to use the Service ceases immediately, and we may 
                delete your account and data as outlined in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimers and Limitation of Liability</h2>
              <h3 className="text-xl font-medium text-foreground mb-3">Disclaimers</h3>
              <p className="text-muted-foreground mb-4">
                The Service is provided "as is" and "as available" without warranties of any kind, 
                either express or implied, including but not limited to implied warranties of 
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Limitation of Liability</h3>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, MinimalAuth shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including but 
                not limited to loss of profits, data, or use, even if we have been advised of the 
                possibility of such damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these Terms at any time. When we make changes, we will:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Update the "Last updated" date at the top of this page</li>
                <li>Notify users through our applications when material changes are made</li>
                <li>Provide a reasonable notice period before changes take effect</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Your continued use of the Service after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These Terms shall be governed by and construed in accordance with applicable laws, 
                without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us through 
                our <Link href="/contact" className="text-primary hover:underline" data-testid="link-contact-inline">contact page</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}