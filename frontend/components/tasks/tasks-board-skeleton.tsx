import { Skeleton } from "@/components/ui/skeleton";

const skeletonColumns = [3, 2, 2, 3];

export function TasksBoardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      

      {/* Board */}
      <div className="grid grid-cols-1 gap-4 px-7 pb-7 md:grid-cols-2 xl:grid-cols-4">
        {skeletonColumns.map((cardCount, columnIndex) => (
          <div
            key={columnIndex}
            className="min-h-[620px] rounded-2xl border bg-muted/10 p-2.5"
          >
            {/* Column header */}
            <div className="flex h-12 items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-7 rounded-full" />
              </div>

              <Skeleton className="h-5 w-5 rounded" />
            </div>

            {/* Task cards */}
            <div className="space-y-2.5">
              {Array.from({ length: cardCount }).map((_, cardIndex) => (
                <TaskCardSkeleton
                  key={cardIndex}
                  cardIndex={cardIndex}
                />
              ))}
            </div>

            {/* Add task */}
            <div className="mt-5 flex items-center gap-2 px-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCardSkeleton({ cardIndex }: { cardIndex: number }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      {/* Task title */}
      <Skeleton
        className={`h-5 ${
          cardIndex === 1 ? "w-40" : cardIndex === 2 ? "w-32" : "w-24"
        }`}
      />

      {/* Member + date */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-1">
          <Skeleton className="h-8 w-8 rounded-full" />

          {cardIndex === 1 && (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </div>

        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>

      {/* Divider */}
      <div className="my-3 border-t" />

      {/* Priority + labels */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-7 w-16 rounded-lg" />
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
    </div>
  );
}