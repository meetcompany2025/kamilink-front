import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64 mt-4" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>

      <Skeleton className="h-32 w-full mb-8 rounded-lg" />

      <div className="space-y-6">
        <div>
          <Skeleton className="h-64 w-full mb-4 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>

          <Skeleton className="h-[400px] w-full mb-6 rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}
