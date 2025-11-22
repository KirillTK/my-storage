import { DashboardHeader } from "~/widgets/dashboard-header/ui";
import { SearchStorage } from "~/widgets/search-storage";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <DashboardHeader>
        <SearchStorage />
      </DashboardHeader>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
