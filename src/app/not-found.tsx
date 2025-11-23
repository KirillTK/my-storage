import Link from "next/link";
import { Button } from "~/shared/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-9xl font-bold text-transparent">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="bg-muted mb-6 inline-flex rounded-full p-4">
          <Search className="text-muted-foreground h-12 w-12" />
        </div>

        {/* Message */}
        <h2 className="text-foreground mb-3 text-2xl font-semibold">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 text-base">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-muted-foreground mt-8 text-sm">
          Need help?{" "}
          <Link
            href="/"
            className="text-primary hover:underline font-medium"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}

