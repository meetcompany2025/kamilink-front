import { Skeleton } from "@/components/ui/skeleton"

export default function FAQLoading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
      </div>

      <Skeleton className="h-10 w-full max-w-md mx-auto mb-8" />

      <div className="max-w-3xl mx-auto">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 flex-1" />
          ))}
        </div>

        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  )
}
