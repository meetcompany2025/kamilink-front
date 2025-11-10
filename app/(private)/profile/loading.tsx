import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64 mt-4" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
        <div className="md:w-2/3">
          <Skeleton className="h-10 w-full rounded-lg mb-6" />
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
