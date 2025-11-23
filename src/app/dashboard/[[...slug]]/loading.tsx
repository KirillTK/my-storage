import { Skeleton } from "~/shared/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col gap-4">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-4" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Storage Grid Skeleton */}
      <div className="flex-1 overflow-auto">
        {/* Folders Section */}
        <div className="mb-6">
          <Skeleton className="mb-2 h-6 w-20" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`folder-${i}`}
                className="border-border bg-card hover:bg-accent flex items-center gap-3 rounded-lg border p-4 transition-colors"
              >
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <Skeleton className="mb-2 h-6 w-28" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`document-${i}`}
                className="border-border bg-card hover:bg-accent flex items-center gap-3 rounded-lg border p-4 transition-colors"
              >
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

