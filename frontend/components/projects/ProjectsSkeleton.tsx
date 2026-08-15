import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr
          key={index}
          className="border-b border-border last:border-0"
        >
          {/* Project */}
          <td className="px-4 py-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[240px] max-w-full" />
              <Skeleton className="h-3 w-[320px] max-w-full" />
            </div>
          </td>

          {/* Priority */}
          <td className="hidden px-4 py-5 sm:table-cell">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </td>

          {/* Lead */}
          <td className="hidden px-4 py-5 sm:table-cell">
            <Skeleton className="h-8 w-8 rounded-full" />
          </td>

          {/* Status */}
          <td className="hidden px-4 py-5 md:table-cell">
            <Skeleton className="h-7 w-[90px] rounded-md" />
          </td>

          {/* Due Date */}
          <td className="hidden px-4 py-5 md:table-cell">
            <Skeleton className="h-4 w-[100px]" />
          </td>

          {/* Actions */}
          <td className="px-4 py-5">
            <Skeleton className="ml-auto h-8 w-8 rounded-md" />
          </td>
        </tr>
      ))}
    </>
  );
}