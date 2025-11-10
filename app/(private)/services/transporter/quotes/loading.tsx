import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64 mt-4" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-[250px] w-full rounded-lg" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  )
}
