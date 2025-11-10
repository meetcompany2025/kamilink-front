import { Skeleton } from "@/components/ui/skeleton"

export default function TransporterDashboardLoading() {
  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-[180px] rounded-lg" />
        <Skeleton className="h-[180px] rounded-lg" />
        <Skeleton className="h-[180px] rounded-lg" />
      </div>

      <Skeleton className="h-[400px] rounded-lg" />

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    </div>
  )
}
