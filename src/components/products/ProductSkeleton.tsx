import { Skeleton } from "../ui/Skeleton";

interface ProductSkeletonProps {
  viewMode?: "grid" | "list";
}

export function ProductSkeleton({ viewMode = "grid" }: ProductSkeletonProps) {
  if (viewMode === "list") {
    return (
      <div className="glass rounded-3xl p-4 flex flex-row gap-6 items-center h-full">
        <Skeleton className="w-48 h-48 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-4 flex flex-col h-full">
      <Skeleton className="w-full aspect-[4/3] rounded-2xl mb-4" />
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-20" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6, viewMode = "grid" }: { count?: number, viewMode?: "grid" | "list" }) {
  return (
    <div className={viewMode === "grid" 
      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
      : "flex flex-col gap-6"
    }>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery Skeleton */}
        <div className="space-y-6">
          <Skeleton className="w-full aspect-square rounded-[2.5rem]" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-24 h-24 rounded-2xl shrink-0" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/3 rounded-full" />
            <Skeleton className="h-10 w-1/4" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          
          <Skeleton className="h-px w-full" />
          
          <div className="space-y-4">
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-24 rounded-xl" />)}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-10 w-32 rounded-xl" />)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8">
            <Skeleton className="h-14 w-full sm:w-32 rounded-2xl" />
            <Skeleton className="h-14 flex-1 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
