import { UserProfileMenu } from '@/_entities/user/components/user-profile-menu/ui';
import { FolderOpen, Plus, Upload } from 'lucide-react';
import { Button } from '~/app/_shared/components/ui/button';

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <FolderOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{"Data Room"}</h1>
            <p className="text-sm text-muted-foreground">{"Secure document management"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            {"New Folder"}
          </Button>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            {"Upload"}
          </Button>

          <UserProfileMenu hideDashboardLink />
        </div>
      </div>
    </header>
  )
}