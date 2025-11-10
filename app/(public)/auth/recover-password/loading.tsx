import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10 px-4">
      <div className="w-full max-w-md">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
    </div>
  )
}
