import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  "Task",
  "Priority",
  "Members",
  "Labels",
  "Due Date",
  "Actions",
];

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_50px] items-center border-b border-slate-800 px-5 py-4 last:border-b-0">
      {/* Task */}
      <Skeleton className="h-4 w-40 bg-slate-800" />

      {/* Priority */}
      <Skeleton className="h-4 w-20 bg-slate-800" />

      {/* Members */}
      <div className="flex -space-x-2">
        <Skeleton className="h-8 w-8 rounded-full bg-slate-700" />
        <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
      </div>

      {/* Labels */}
      <div className="flex gap-2">
        <Skeleton className="h-7 w-16 rounded-lg bg-slate-800" />
        <Skeleton className="h-7 w-20 rounded-lg bg-slate-800" />
      </div>

      {/* Due date */}
      <Skeleton className="h-4 w-24 bg-slate-800" />

      {/* Actions */}
      <Skeleton className="h-5 w-5 rounded bg-slate-800" />
    </div>
  );
}

function SkeletonSection({
  color,
  rows = 2,
}: {
  color: string;
  rows?: number;
}) {
  return (
    <section>
      {/* Section header */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-slate-300">⌄</span>

        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />

        <Skeleton className="h-4 w-20 bg-slate-800" />

        <Skeleton className="h-6 w-8 rounded-full bg-slate-800" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111a2d]">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_1fr_50px] border-b border-slate-800 bg-[#0d1526] px-5 py-4">
          {columns.map((column) => (
            <Skeleton
              key={column}
              className={`h-3 bg-slate-800 ${
                column === "Task"
                  ? "w-12"
                  : column === "Priority"
                    ? "w-16"
                    : column === "Members"
                      ? "w-20"
                      : column === "Labels"
                        ? "w-14"
                        : column === "Due Date"
                          ? "w-20"
                          : "w-10"
              }`}
            />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}

        {/* Add task */}
        <div className="flex items-center gap-3 px-5 py-4">
          <Skeleton className="h-5 w-5 bg-slate-800" />
          <Skeleton className="h-4 w-16 bg-slate-800" />
        </div>
      </div>
    </section>
  );
}

export function TaskBoardSkeleton() {
  return (
    <div className="space-y-10">
      <SkeletonSection color="bg-slate-400" rows={2} />
      <SkeletonSection color="bg-blue-500" rows={2} />
      <SkeletonSection color="bg-emerald-500" rows={2} />
    </div>
  );
}