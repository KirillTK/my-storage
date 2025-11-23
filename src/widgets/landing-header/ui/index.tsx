import Link from "next/link";
import { SignInButton } from "~/features/sign-in-button/ui";
import { auth } from "~/server/auth";

export async function LandingHeader() {
  const session = await auth();
  const redirectLink = session?.user ? "/dashboard" : "/";

  return (
    <nav className="border-border bg-background/50 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href={redirectLink} prefetch>
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold">
              D
            </div>
            <h1 className="text-foreground text-xl font-bold">DataRoom</h1>
          </div>
        </Link>
        <SignInButton />
      </div>
    </nav>
  );
}
