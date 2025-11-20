import { ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Button } from '~/app/_shared/components/ui/button';
import { auth, signIn } from '~/server/auth';

export async function HeroSection() {
  const session = await auth();

  const handleGetStarted = async () => {
    'use server';

    if (session) {
      redirect('/dashboard');
    }

    await signIn('google', { redirectTo: '/dashboard' });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
        {/* Hero Content */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent/30 px-4 py-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">Secure file management, reimagined</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Your secure data room for seamless collaboration
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload, organize, and share files with enterprise-grade security. Manage permissions, track versions, and
            maintain complete audit logs—all in one intuitive platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button

              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base font-medium rounded-full"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-medium rounded-full border-border hover:bg-accent bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12">
          {/* Feature 1 */}
          <div className="rounded-lg border border-border bg-card p-6 text-left hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-xl">📁</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Easy Organization</h3>
            <p className="text-muted-foreground text-sm">
              Create folders, upload files, and keep everything organized with an intuitive drag-and-drop interface.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg border border-border bg-card p-6 text-left hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Enterprise Security</h3>
            <p className="text-muted-foreground text-sm">
              Bank-level encryption and advanced security controls keep your sensitive data protected at all times.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg border border-border bg-card p-6 text-left hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Collaboration Made Easy</h3>
            <p className="text-muted-foreground text-sm">
              Share files with team members, manage permissions, and collaborate in real-time from anywhere.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="w-full pt-12 border-t border-border">
          <p className="text-sm text-muted-foreground mb-6">Trusted by teams worldwide</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <span className="font-semibold text-foreground/60">TechCorp</span>
            <span className="font-semibold text-foreground/60">DataSync</span>
            <span className="font-semibold text-foreground/60">CloudBase</span>
            <span className="font-semibold text-foreground/60">SecureFlow</span>
          </div>
        </div>
      </div>
    </main>
  )
}