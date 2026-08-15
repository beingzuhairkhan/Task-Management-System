import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSkeleton() {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-background">
      <table className="w-full table-fixed">
        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (
            <tr
              key={index}
              className="border-b border-border last:border-0"
            >
              {/* Project */}
              <td className="w-[35%] px-5 py-5">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-[240px] max-w-full" />
                  <Skeleton className="h-3 w-[320px] max-w-full" />
                </div>
              </td>

              {/* Priority */}
              <td className="w-[15%] px-4 py-5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </td>

              {/* Lead */}
              <td className="w-[12%] px-4 py-5">
                <Skeleton className="h-8 w-8 rounded-full" />
              </td>

              {/* Status */}
              <td className="w-[15%] px-4 py-5">
                <Skeleton className="h-7 w-[90px] rounded-md" />
              </td>

              {/* Due Date */}
              <td className="w-[15%] px-4 py-5">
                <Skeleton className="h-4 w-[100px]" />
              </td>

              {/* Actions */}
              <td className="w-[8%] px-4 py-5">
                <Skeleton className="ml-auto h-8 w-8 rounded-md" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add project row */}
      <div className="flex items-center gap-3 border-t border-border px-5 py-4">
        <Skeleton className="h-5 w-5 rounded-md" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}