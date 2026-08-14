import { Skeleton } from "@/components/ui/skeleton";

export function TaskDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Top breadcrumb/header */}
            <div className="flex h-[56px] items-center border-b px-6">
                <Skeleton className="h-4 w-4 rounded-full" />

                <Skeleton className="ml-5 h-3.5 w-16" />
                <Skeleton className="mx-2.5 h-3.5 w-2.5" />
                <Skeleton className="h-3.5 w-12" />
                <Skeleton className="mx-2.5 h-3.5 w-2.5" />
                <Skeleton className="h-4 w-32" />

                <div className="ml-auto">
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 xl:grid-cols-[1fr_320px]">
                {/* Main content */}
                <main className="min-w-0">
                    {/* Title + description */}
                    <div className="mb-6">
                        <Skeleton className="h-7 w-60" />
                        <Skeleton className="mt-2.5 h-3.5 w-[580px] max-w-full" />
                        <Skeleton className="mt-1.5 h-3.5 w-[440px] max-w-full" />
                    </div>

                    {/* Properties card */}
                    <div className="rounded-xl border p-3.5">
                        <div className="grid grid-cols-[90px_1fr] gap-y-4">
                            {/* Properties */}
                            <Skeleton className="h-3.5 w-16" />

                            <div className="flex gap-2.5">
                                <Skeleton className="h-7 w-32 rounded-full" />
                                <Skeleton className="h-7 w-28 rounded-lg" />
                            </div>

                            {/* Labels */}
                            <Skeleton className="h-3.5 w-12" />

                            <div className="flex flex-wrap gap-1.5">
                                <Skeleton className="h-6 w-18 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-18 rounded-full" />
                                <Skeleton className="h-6 w-14 rounded-full" />
                                <Skeleton className="h-6 w-14 rounded-full" />
                            </div>

                            {/* Resources */}
                            <Skeleton className="h-3.5 w-16" />

                            <div className="flex gap-2.5">
                                <Skeleton className="h-7 w-60 max-w-full rounded-lg" />
                                <Skeleton className="h-7 w-40 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="mt-5 overflow-hidden rounded-xl border">
                        {/* Section header */}
                        <div className="flex h-12 items-center gap-2.5 border-b px-4">
                            <Skeleton className="h-3.5 w-3.5 rounded" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-6 rounded-full" />
                        </div>

                        {/* Table header */}
                        <div className="grid grid-cols-[1fr_1fr_1fr_80px_120px_40px] gap-3 border-b px-4 py-3">
                            <Skeleton className="h-3.5 w-10" />
                            <Skeleton className="h-3.5 w-12" />
                            <Skeleton className="h-3.5 w-14" />
                            <Skeleton className="h-3.5 w-12" />
                            <Skeleton className="h-3.5 w-14" />
                            <Skeleton className="h-3.5 w-10" />
                        </div>

                        {/* Rows */}
                        {[1, 2, 3].map((row) => (
                            <div
                                key={row}
                                className="grid grid-cols-[1fr_1fr_1fr_80px_120px_40px] items-center gap-3 border-b px-4 py-3 last:border-b-0"
                            >
                                <Skeleton className="h-3.5 w-14" />

                                <Skeleton className="h-7 w-24 rounded-lg" />

                                <Skeleton className="h-3.5 w-14" />

                                <Skeleton className="h-7 w-7 rounded-full" />

                                <Skeleton className="h-3.5 w-20" />

                                <Skeleton className="h-4 w-4 rounded" />
                            </div>
                        ))}

                        {/* Add subtask */}
                        <div className="flex items-center gap-2.5 px-4 py-3">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-3.5 w-20" />
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="mt-5 rounded-xl border p-3.5">
                        <Skeleton className="h-4 w-20" />

                        <Skeleton className="mt-4 h-3.5 w-24" />

                        <div className="mt-4 flex h-10 items-center rounded-lg border px-3">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="ml-auto h-4 w-4 rounded" />
                        </div>
                    </div>
                </main>

                {/* Right sidebar */}
                <aside className="space-y-3">
                    {/* Details */}
                    <div className="rounded-xl border">
                        <div className="flex h-11 items-center gap-2.5 border-b px-4">
                            <Skeleton className="h-3.5 w-3.5 rounded" />
                            <Skeleton className="h-4 w-14" />
                        </div>

                        <div className="space-y-5 p-4">
                            {[
                                "Status",
                                "Group",
                                "Priority",
                                "Members",
                                "End Dates",
                                "Reporter",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="grid grid-cols-[95px_1fr] items-center gap-3"
                                >
                                    <Skeleton className="h-3.5 w-14" />

                                    {item === "Members" ? (
                                        <div className="flex gap-1">
                                            <Skeleton className="h-7 w-7 rounded-full" />
                                            <Skeleton className="h-7 w-7 rounded-full" />
                                            <Skeleton className="h-7 w-14 rounded-lg" />
                                        </div>
                                    ) : (
                                        <Skeleton className="h-4 w-20" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Updates */}
                    <div className="rounded-xl border">
                        <div className="flex h-11 items-center gap-2.5 border-b px-4">
                            <Skeleton className="h-3.5 w-3.5 rounded" />
                            <Skeleton className="h-4 w-16" />
                        </div>

                        <div className="space-y-5 p-4">
                            {[1, 2, 3, 4].map((update) => (
                                <div
                                    key={update}
                                    className="flex gap-2.5"
                                >
                                    <Skeleton className="h-7 w-7 shrink-0 rounded-full" />

                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton className="h-3.5 w-full" />
                                        <Skeleton className="h-3.5 w-3/4" />
                                        <Skeleton className="h-2.5 w-10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}