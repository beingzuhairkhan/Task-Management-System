import { Skeleton } from "@/components/ui/skeleton";

export function TaskDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Top breadcrumb/header */}
            <div className="flex h-[60px] items-center border-b px-8">
                <Skeleton className="h-5 w-5 rounded-full" />

                <Skeleton className="ml-6 h-4 w-20" />
                <Skeleton className="mx-3 h-4 w-3" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="mx-3 h-4 w-3" />
                <Skeleton className="h-5 w-40" />

                <div className="ml-auto">
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-8 xl:grid-cols-[1fr_360px]">
                {/* Main content */}
                <main className="min-w-0">
                    {/* Title + description */}
                    <div className="mb-7">
                        <Skeleton className="h-8 w-72" />
                        <Skeleton className="mt-3 h-4 w-[650px] max-w-full" />
                        <Skeleton className="mt-2 h-4 w-[500px] max-w-full" />
                    </div>

                    {/* Properties card */}
                    <div className="rounded-2xl border p-4">
                        <div className="grid grid-cols-[100px_1fr] gap-y-5">
                            {/* Properties */}
                            <Skeleton className="h-4 w-20" />

                            <div className="flex gap-3">
                                <Skeleton className="h-8 w-40 rounded-full" />
                                <Skeleton className="h-8 w-32 rounded-lg" />
                            </div>

                            {/* Labels */}
                            <Skeleton className="h-4 w-14" />

                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-7 w-20 rounded-full" />
                                <Skeleton className="h-7 w-24 rounded-full" />
                                <Skeleton className="h-7 w-20 rounded-full" />
                                <Skeleton className="h-7 w-16 rounded-full" />
                                <Skeleton className="h-7 w-16 rounded-full" />
                            </div>

                            {/* Resources */}
                            <Skeleton className="h-4 w-20" />

                            <div className="flex gap-3">
                                <Skeleton className="h-8 w-72 max-w-full rounded-lg" />
                                <Skeleton className="h-8 w-48 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="mt-6 overflow-hidden rounded-2xl border">
                        {/* Section header */}
                        <div className="flex h-14 items-center gap-3 border-b px-5">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-7 rounded-full" />
                        </div>

                        {/* Table header */}
                        <div className="grid grid-cols-[1fr_1fr_1fr_100px_140px_50px] gap-4 border-b px-5 py-4">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-14" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-14" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                        </div>

                        {/* Rows */}
                        {[1, 2, 3].map((row) => (
                            <div
                                key={row}
                                className="grid grid-cols-[1fr_1fr_1fr_100px_140px_50px] items-center gap-4 border-b px-5 py-4 last:border-b-0"
                            >
                                <Skeleton className="h-4 w-16" />

                                <Skeleton className="h-8 w-28 rounded-lg" />

                                <Skeleton className="h-4 w-16" />

                                <Skeleton className="h-8 w-8 rounded-full" />

                                <Skeleton className="h-4 w-24" />

                                <Skeleton className="h-5 w-5 rounded" />
                            </div>
                        ))}

                        {/* Add subtask */}
                        <div className="flex items-center gap-3 px-5 py-4">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="mt-6 rounded-2xl border p-4">
                        <Skeleton className="h-5 w-24" />

                        <Skeleton className="mt-5 h-4 w-28" />

                        <div className="mt-5 flex h-12 items-center rounded-xl border px-4">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="ml-auto h-5 w-5 rounded" />
                        </div>
                    </div>
                </main>

                {/* Right sidebar */}
                <aside className="space-y-4">
                    {/* Details */}
                    <div className="rounded-2xl border">
                        <div className="flex h-12 items-center gap-3 border-b px-5">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-5 w-16" />
                        </div>

                        <div className="space-y-6 p-5">
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
                                    className="grid grid-cols-[110px_1fr] items-center gap-4"
                                >
                                    <Skeleton className="h-4 w-16" />

                                    {item === "Members" ? (
                                        <div className="flex gap-1">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-16 rounded-lg" />
                                        </div>
                                    ) : (
                                        <Skeleton className="h-5 w-24" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Updates */}
                    <div className="rounded-2xl border">
                        <div className="flex h-12 items-center gap-3 border-b px-5">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-5 w-20" />
                        </div>

                        <div className="space-y-6 p-5">
                            {[1, 2, 3, 4].map((update) => (
                                <div
                                    key={update}
                                    className="flex gap-3"
                                >
                                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-12" />
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