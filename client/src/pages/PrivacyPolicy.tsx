import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="privacy-policy-title">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: September 18, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Privacy Philosophy</h2>
              <p className="text-muted-foreground mb-4">
                At MinimalAuth, privacy isn't just a feature—it's our foundation. We believe that your personal 
                information belongs to you, and we've built our entire platform around this principle.
              </p>
              <p className="text-muted-foreground mb-4">
                Unlike traditional authentication systems that collect extensive personal data, MinimalAuth 
                operates on a minimal data collection model. We only collect what is absolutely necessary 
                for our services to function, and we never sell or share your information with third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">Account Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Username:</strong> A unique identifier you choose for your account</li>
                <li><strong>Password:</strong> Securely hashed and never stored in plain text</li>
                <li><strong>Recovery Key:</strong> An encrypted backup method for account recovery</li>
              </ul>
              
              <h3 className="text-xl font-medium text-foreground mb-3">What We Don't Collect</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Email addresses or phone numbers</li>
                <li>Real names or personal identification</li>
                <li>Location data or IP address tracking</li>
                <li>Browsing history or behavioral analytics</li>
                <li>Third-party integrations or social media data</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">Technical Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Session data (temporary, deleted when you log out)</li>
                <li>Application usage statistics (anonymized and aggregated)</li>
                <li>Error logs (for improving service reliability)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Authentication:</strong> To verify your identity and provide secure access</li>
                <li><strong>Account Recovery:</strong> To help you regain access if you forget your password</li>
                <li><strong>Service Improvement:</strong> To identify and fix issues in our applications</li>
                <li><strong>Security:</strong> To protect against unauthorized access and abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>All passwords are hashed using bcrypt with salt</li>
                <li>Recovery keys are encrypted before storage</li>
                <li>All data transmission is encrypted using HTTPS</li>
                <li>Regular security audits and updates</li>
                <li>Limited access controls for our development team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                We retain your data only as long as necessary:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Account data is retained while your account is active</li>
                <li>Session data is automatically deleted when you log out</li>
                <li>Error logs are retained for 30 days maximum</li>
                <li>Usage statistics are anonymized and aggregated immediately</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have complete control over your data:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li><strong>Access:</strong> View all data we have about your account</li>
                <li><strong>Deletion:</strong> Permanently delete your account and all associated data</li>
                <li><strong>Portability:</strong> Export your data in a standard format</li>
                <li><strong>Correction:</strong> Update or correct any information in your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground mb-4">
                MinimalAuth applications may integrate with third-party services. Each application 
                clearly discloses any external integrations, and you maintain full control over 
                what data, if any, is shared with these services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this privacy policy from time to time. When we do, we will notify 
                users through our applications and update the "Last updated" date at the top of 
                this page. Continued use of our services after such changes constitutes acceptance 
                of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy or our data practices, 
                please contact us through our <Link href="/contact" className="text-primary hover:underline" data-testid="link-contact-inline">contact page</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}