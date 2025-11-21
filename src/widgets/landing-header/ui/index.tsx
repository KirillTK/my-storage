import { SignInButton } from '~/features/sign-in-button/ui';

export function LandingHeader() {
  return (
    <nav className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            D
          </div>
          <h1 className="text-xl font-bold text-foreground">DataRoom</h1>
        </div>
        <SignInButton />
      </div>
    </nav>
  )
}