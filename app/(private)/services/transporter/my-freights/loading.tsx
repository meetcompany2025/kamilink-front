import { Skeleton } from "@/components/ui/skeleton"

export default function MyFreightsLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-48 mb-6" />

      <div className="grid gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <Skeleton className="h-8 w-36 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}
