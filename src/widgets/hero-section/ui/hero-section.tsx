import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "~/shared/components/ui/button";
import { auth, signIn } from "~/server/auth";

export async function HeroSection() {
  const session = await auth();

  const handleGetStarted = async () => {
    "use server";

    if (session) {
      redirect("/dashboard");
    }

    await signIn("google", { redirectTo: "/dashboard" });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center">
        {/* Hero Content */}
        <div className="max-w-3xl space-y-6">
          <div className="border-border bg-accent/30 inline-flex items-center gap-2 rounded-full border px-4 py-2">
            <span className="bg-primary inline-block h-2 w-2 rounded-full" />
            <span className="text-foreground text-sm font-medium">
              Your personal file storage
            </span>
          </div>

          <h2 className="text-foreground text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            Store, organize, and access your files anywhere
          </h2>

          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            A simple and efficient way to manage your digital files with
            folders, preview, and search.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full px-8 text-base font-medium"
              onClick={handleGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-accent h-12 rounded-full bg-transparent px-8 text-base font-medium"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid w-full grid-cols-1 gap-6 pt-12 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="border-border bg-card rounded-lg border p-6 text-left transition-shadow hover:shadow-md">
            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <span className="text-xl">📁</span>
            </div>
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Folder Organization
            </h3>
            <p className="text-muted-foreground text-sm">
              Create nested folders, upload files, and keep everything organized
              with an intuitive interface and breadcrumb navigation.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border-border bg-card rounded-lg border p-6 text-left transition-shadow hover:shadow-md">
            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <span className="text-xl">👁️</span>
            </div>
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              File Preview
            </h3>
            <p className="text-muted-foreground text-sm">
              Preview your files instantly with support for images, PDFs,
              videos, audio, and text documents directly in your browser.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border-border bg-card rounded-lg border p-6 text-left transition-shadow hover:shadow-md">
            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <span className="text-xl">🔍</span>
            </div>
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Quick Search
            </h3>
            <p className="text-muted-foreground text-sm">
              Find your files and folders quickly with instant search
              functionality that looks through all your stored content.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="border-border w-full border-t pt-12">
          <p className="text-muted-foreground mb-6 text-sm">
            Your files, your way
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            <div className="text-center">
              <div className="text-foreground text-2xl font-bold">
                Unlimited
              </div>
              <div className="text-muted-foreground text-sm">Storage Space</div>
            </div>
            <div className="text-center">
              <div className="text-foreground text-2xl font-bold">
                All Types
              </div>
              <div className="text-muted-foreground text-sm">File Support</div>
            </div>
            <div className="text-center">
              <div className="text-foreground text-2xl font-bold">Instant</div>
              <div className="text-muted-foreground text-sm">File Preview</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
