import {Skeleton} from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
