import { UserProfileMenu } from '~/entities/user/components/user-profile-menu/ui';
import { FolderOpen } from 'lucide-react';
import { NewFolderButton } from '~/features/new-folder-button/ui';
import { UploadDocumentButton } from '~/features/upload-document-button/ui';
import Link from 'next/link';

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Link href="/dashboard">
              <FolderOpen className="h-5 w-5 text-primary-foreground" />
            </Link>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{"Data Room"}</h1>
            <p className="text-sm text-muted-foreground">{"Secure document management"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NewFolderButton />
          <UploadDocumentButton />

          <UserProfileMenu hideDashboardLink />
        </div>
      </div>
    </header>
  )
}