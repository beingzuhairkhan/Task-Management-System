import { Skeleton } from "@/components/ui/skeleton"

export function ProjectsSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      {/* Table header */}
      <div className="grid grid-cols-[minmax(320px,2fr)_1fr_80px_1fr_1fr_50px] items-center border-b border-slate-800 px-5 py-4">
        <Skeleton className="h-4 w-20 bg-slate-800" />
        <Skeleton className="h-4 w-16 bg-slate-800" />
        <Skeleton className="h-4 w-12 bg-slate-800" />
        <Skeleton className="h-4 w-14 bg-slate-800" />
        <Skeleton className="h-4 w-16 bg-slate-800" />
        <Skeleton className="ml-auto h-4 w-10 bg-slate-800" />
      </div>

      {/* Rows */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[minmax(320px,2fr)_1fr_80px_1fr_1fr_50px] items-center border-b border-slate-800 px-5 py-5 last:border-b-0"
        >
          {/* Project */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-52 bg-slate-800" />
            <Skeleton className="h-3.5 w-72 bg-slate-900" />
          </div>

          {/* Priority */}
          <Skeleton className="h-4 w-20 bg-slate-800" />

          {/* Lead */}
          <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />

          {/* Status */}
          <Skeleton className="h-7 w-20 rounded-lg bg-slate-800" />

          {/* Due date */}
          <Skeleton className="h-4 w-24 bg-slate-800" />

          {/* Actions */}
          <Skeleton className="ml-auto h-5 w-5 rounded-full bg-slate-800" />
        </div>
      ))}

      {/* Add projects */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Skeleton className="h-5 w-5 bg-slate-800" />
        <Skeleton className="h-4 w-28 bg-slate-800" />
      </div>
    </div>
  )
}