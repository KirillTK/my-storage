import { UserProfileMenu } from "~/entities/user/components/user-profile-menu/ui";
import { FolderOpen } from "lucide-react";
import { NewFolderButton } from "~/features/new-folder-button/ui";
import { UploadDocumentButton } from "~/features/upload-document-button/ui";
import Link from "next/link";

export function DashboardHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="border-border bg-card border-b">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <Link href="/dashboard">
              <FolderOpen className="text-primary-foreground h-5 w-5" />
            </Link>
          </div>
          <div className="hidden md:block">
            <h1 className="text-foreground text-xl font-semibold">
              {"Data Room"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {"Secure document management"}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-2xl">
          {children}
        </div>

        <div className="flex items-center gap-2">
          <NewFolderButton />
          <UploadDocumentButton />

          <UserProfileMenu hideDashboardLink />
        </div>
      </div>
    </header>
  );
}
