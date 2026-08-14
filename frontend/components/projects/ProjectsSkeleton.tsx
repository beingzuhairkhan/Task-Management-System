import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
      <table className="w-full">
        {/* Header */}
        <thead>
          <tr className="border-b border-border">
            {/* Project */}
            <th className="px-5 py-4 text-left">
              <Skeleton className="h-4 w-16" />
            </th>

            {/* Priority */}
            <th className="px-4 py-4 text-left">
              <Skeleton className="h-4 w-16" />
            </th>

            {/* Lead */}
            <th className="px-4 py-4 text-left">
              <Skeleton className="h-4 w-10" />
            </th>

            {/* Status */}
            <th className="px-4 py-4 text-left">
              <Skeleton className="h-4 w-12" />
            </th>

            {/* Due Date */}
            <th className="px-4 py-4 text-left">
              <Skeleton className="h-4 w-16" />
            </th>

            {/* Actions */}
            <th className="w-12 px-4 py-4">
              <Skeleton className="ml-auto h-4 w-4" />
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (
            <tr
              key={index}
              className="border-b border-border last:border-0"
            >
              {/* Project */}
              <td className="px-5 py-5">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-[240px]" />
                  <Skeleton className="h-3 w-[320px]" />
                </div>
              </td>

              {/* Priority */}
              <td className="px-4 py-5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </td>

              {/* Lead */}
              <td className="px-4 py-5">
                <Skeleton className="h-8 w-8 rounded-full" />
              </td>

              {/* Status */}
              <td className="px-4 py-5">
                <Skeleton className="h-7 w-[90px] rounded-md" />
              </td>

              {/* Due Date */}
              <td className="px-4 py-5">
                <Skeleton className="h-4 w-[100px]" />
              </td>

              {/* Actions */}
              <td className="px-4 py-5">
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