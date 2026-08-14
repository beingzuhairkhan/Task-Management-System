"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    ArrowLeft,
    CalendarDays,
    Check,
    ChevronDown,
    Lock,
    Eye,
    Share2,
    MoreHorizontal,
    Plus,
    Send,
    Settings2,
    Trash2,
    Paperclip,
    Pencil,
} from "lucide-react";

import {
    LabelChip,
    MemberAvatar,
    MemberStack,
    PriorityTag,
} from "@/components/tasks/primitives";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { AppSidebar } from "@/components/tasks/app-sidebar";
import { Updates } from "@/components/tasks/taskUpdates";
import {
    groups,
    priorities,
    statusOptions,
     TaskPriority,
} from "@/lib/tasks-data";

import {TaskDetailsSkeleton} from "@/components/tasks/TaskDetailsSkeleton"

import { SubtasksSection } from "@/components/tasks/SubtasksSection";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { taskAPI, labelAPI, userAPI, activityAPI, subTaskAPI, commentAPI } from "@/services/api";
import { User, Subtask, Comment, Task } from "@/lib/tasks-data"
import { formatDate } from "@/lib/date-utils";


// ROW


function Row({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-4 py-2">
            <div className="w-20 shrink-0 text-xs text-muted-foreground">
                {label}
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                {children}
            </div>
        </div>
    );
}




// NORMALIZE TASK


function normalizeTask(raw: any): Task {
    const reporter = raw.reporter
        ? {
            id: raw.reporter.id ?? raw.reporter._id ?? "",
            username: raw.reporter.username ?? "Unknown",
            avatar: raw.reporter.avatar ?? "",
            email: raw.reporter.email ?? "",
            jobTitle: raw.reporter.jobTitle ?? "",
        }
        : {
            id: "",
            username: "Unknown",
            avatar: "",
            email: "",
            jobTitle: ""
        };

    const members = Array.isArray(raw.members)
        ? raw.members.map((member: any) => ({
            id: member.id ?? member._id ?? "",
            username: member.username ?? "",
            avatar: member.avatar ?? "",
            email: member.email ?? "",
        }))
        : [];

    const labels = Array.isArray(raw.labels)
        ? raw.labels.map((label: any) => String(label))
        : [];

    const resources = Array.isArray(raw.resources)
        ? raw.resources.map((resource: any) => String(resource))
        : [];

    const subtasks: Subtask[] = Array.isArray(raw.subtasks)
        ? raw.subtasks.map((subtask: any) => {
            const subMember = subtask.subMember
                ? {
                    id:
                        subtask.subMember.id ??
                        subtask.subMember._id ??
                        "",
                    username:
                        subtask.subMember.username ?? "",
                    avatar:
                        subtask.subMember.avatar ?? "",
                    email:
                        subtask.subMember.email ?? "",
                }
                : null;

            return {
                id: subtask.id ?? subtask._id ?? "",
                title: subtask.title ?? "",
                description: subtask.description ?? "",
                status: subtask.status ?? "OPEN",
                priority: subtask.priority ?? "MEDIUM",
                subMember,
                dueDate: subtask.dueDate ?? undefined,
                order: subtask.order ?? 0,
            };
        })
        : [];



    return {
        ...raw,

        id: raw.id ?? raw._id,

        group: raw.group ?? "TODO",

        due: raw.dueDate
            ? formatDate(raw.dueDate)
            : "No due date",

        dueShort: raw.dueDate
            ? formatDate(raw.dueDate)
            : "No due date",

        reporter,

        members,

        labels,

        resources,

        subtasks,

    };
}

function mapComment(comment: any): Comment {
    return {
        id: comment.id ?? comment._id ?? "",

        body: comment.message ?? "",

        at: comment.createdAt
            ? formatDate(comment.createdAt)
            : "Just now",

        author: {
            id:
                comment.userId?.id ??
                comment.userId?._id ??
                "",

            username:
                comment.userId?.username ??
                comment.author?.username ??
                "Unknown",

            avatar:
                comment.userId?.avatar ??
                comment.author?.avatar ??
                "",

            email:
                comment.userId?.email ??
                comment.author?.email ??
                "",
        },
    };
}

// PAGE


export default function TaskDetailPage() {
    const params = useParams<{
        projectId: string;
        taskId: string;
    }>();

    const projectId = params.projectId;
    const taskId = params.taskId;

    const [task, setTask] = useState<Task | null>(null);

    const [loading, setLoading] = useState(true);

    const [comment, setComment] = useState("");

    const [detailsOpen, setDetailsOpen] = useState(true);

    const [labels, setLabels] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [userActivity, setUserActivity] = useState<any[]>([]);


    const previousTaskRef = useRef<Task | null>(null);

    const isInitialLoadRef = useRef(true);

    const updatingRef = useRef(false);



    // FETCH TASK


    useEffect(() => {
        if (!projectId || !taskId) return;

        const fetchTaskAndLabels = async () => {
            try {
                setLoading(true);

                const [
                    taskResponse,
                    labelResponse,
                    userResponse,
                    activityResponse,
                    commentResponse,
                ] = await Promise.allSettled([
                    taskAPI.getTaskById(projectId, taskId),
                    labelAPI.getLabel(),
                    userAPI.findAllUsers(),
                    activityAPI.getActivityByTaskId(taskId),
                    commentAPI.getComments(taskId),
                ]);

                const rawTask =
                    taskResponse.status === "fulfilled"
                        ? taskResponse.value.data?.data ??
                        taskResponse.value.data
                        : null;

                const fetchedLabels =
                    labelResponse.status === "fulfilled"
                        ? labelResponse.value.data?.data ??
                        labelResponse.value.data ??
                        []
                        : [];

                const fetchMembers =
                    userResponse.status === "fulfilled"
                        ? userResponse.value.data?.data ?? []
                        : [];

                const fetchedActivity =
                    activityResponse.status === "fulfilled"
                        ? activityResponse.value.data?.data ??
                        activityResponse.value.data ??
                        []
                        : [];

                const fetchedComments =
                    commentResponse.status === "fulfilled"
                        ? commentResponse.value.data?.data ??
                        commentResponse.value.data ??
                        []
                        : [];

                const comments: Comment[] =
                    fetchedComments.map(mapComment);

                const normalizedTask = normalizeTask(rawTask);

                normalizedTask.comments = comments;

                setTask(normalizedTask);
                setLabels(fetchedLabels);
                setMembers(fetchMembers);
                setUserActivity(fetchedActivity);

                previousTaskRef.current =
                    normalizedTask;

                isInitialLoadRef.current = false;
            } catch (error) {
                console.error(
                    "Failed to fetch task or labels:",
                    error,
                );

                toast.error(
                    "Failed to load task details",
                );

                setTask(null);
                setLabels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskAndLabels();
    }, [projectId, taskId]);





    // UPDATE TASK API WHEN A FIELD CHANGES


    useEffect(() => {
        if (!task) return;

        if (isInitialLoadRef.current) {
            return;
        }

        const previousTask =
            previousTaskRef.current;

        if (!previousTask) {
            previousTaskRef.current = task;
            return;
        }

        let payload:
            | Record<string, any>
            | null = null;



        if (
            task.title !== previousTask.title
        ) {
            payload = {
                title: task.title,
            };
        }

        else if (
            task.description !==
            previousTask.description
        ) {
            payload = {
                description: task.description,
            };
        }


        else if (
            task.status !== previousTask.status
        ) {
            payload = {
                status: task.status.toUpperCase().replace(/\s+/g, "_"),
            };
        }

        else if (
            task.group !== previousTask.group
        ) {
            payload = {
                group: task.group.toUpperCase().replace(/\s+/g, "_"),
            };
        }

        else if (
            task.priority !== previousTask.priority
        ) {
            payload = {
                priority: task.priority.toUpperCase().replace(/\s+/g, "_"),
            };
        }

        else {
            const currentMemberIds =
                task.members
                    .map((member) => member.id)
                    .sort();

            const previousMemberIds =
                previousTask.members
                    .map((member) => member.id)
                    .sort();

            if (
                JSON.stringify(
                    currentMemberIds,
                ) !==
                JSON.stringify(
                    previousMemberIds,
                )
            ) {
                payload = {
                    members: task.members.map(
                        (member) => member.id,
                    ),
                };
            }
        }


        // LABELS


        if (!payload) {
            const currentLabels =
                [...task.labels].sort();

            const previousLabels =
                [...previousTask.labels].sort();

            if (
                JSON.stringify(
                    currentLabels,
                ) !==
                JSON.stringify(
                    previousLabels,
                )
            ) {
                payload = {
                    labels: task.labels,
                };
            }
        }


        // RESOURCES


        if (!payload) {
            const currentResources =
                [...task.resources].sort();

            const previousResources =
                [...previousTask.resources].sort();

            if (
                JSON.stringify(
                    currentResources,
                ) !==
                JSON.stringify(
                    previousResources,
                )
            ) {
                payload = {
                    resources: task.resources,
                };
            }
        }

        
        if (!payload) {
            previousTaskRef.current = task;
            return;
        }

       
        if (updatingRef.current) {
            return;
        }

        const updateTaskOnServer = async () => {
            try {
                updatingRef.current = true;

                console.log(
                    "Updating task:",
                    payload,
                );

                await taskAPI.updateTaskById(
                    projectId,
                    taskId,
                    payload,
                );

               
                previousTaskRef.current = task;

                toast.success(
                    "Task updated successfully",
                );
            } catch (error) {
                console.error(
                    "Failed to update task:",
                    error,
                );

                toast.error(
                    "Failed to update task",
                );
            } finally {
                updatingRef.current = false;
            }
        };

        updateTaskOnServer();
    }, [
        task,
        projectId,
        taskId,
    ]);



    // LOCAL TASK UPDATE


    const updateTask = (
        updates: Partial<Task>,
    ) => {
        setTask((current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                ...updates,
            };
        });
    };



    // LABEL


    const toggleLabel = (
        label: string,
    ) => {
        if (!task) return;

        updateTask({
            labels: task.labels.includes(
                label,
            )
                ? task.labels.filter(
                    (item) => item !== label,
                )
                : [
                    ...task.labels,
                    label,
                ],
        });
    };



    // MEMBER


    const toggleMember = (member: User) => {
        if (!task) return;

        const isSelected = task.members.some(
            (item) => String(item.id) === String(member.id),
        );

        const updatedMembers = isSelected
            ? task.members.filter(
                (item) => String(item.id) !== String(member.id),
            )
            : [
                ...task.members,
                {
                    id: member.id,
                    username: member.username ,
                    avatar: member.avatar,
                    email: member.email,
                },
            ];

        updateTask({
            members: updatedMembers,
        });
    };



    // ADD RESOURCE


    const addResource = () => {
        if (!task) return;

        const url = window.prompt(
            "Add a document or link URL",
        );

        if (!url?.trim()) return;

        const resource =
            url.trim();

        updateTask({
            resources: [
                ...task.resources,
                resource,
            ],
        });
    };



    // DELETE RESOURCE


    const deleteResource = (
        resource: string,
    ) => {
        if (!task) return;

        updateTask({
            resources:
                task.resources.filter(
                    (item) =>
                        item !== resource,
                ),
        });
    };





    // DELETE SUBTASK


    const deleteSubtask = async (subtaskId: string) => {
        if (!task) return;

        try {
            await subTaskAPI.deleteSubTaskBYId(taskId, subtaskId);

            setTask((current) => {
                if (!current) return current;

                return {
                    ...current,
                    subtasks: current.subtasks.filter(
                        (subtask) => subtask.id !== subtaskId
                    ),
                };
            });

            toast.success("Subtask removed");
        } catch (error) {
            console.error("Failed to delete subtask:", error);

            toast.error("Failed to delete subtask");
        }
    };



    // ADD COMMENT


    const addComment = async () => {
        if (!task || !comment.trim()) {
            return;
        }

        try {
            const response =
                await commentAPI.createComment(
                    task.id,
                    {
                        message: comment.trim(),
                    },
                );

            const rawComment =
                response.data?.data ?? response.data;

            const newComment = mapComment(rawComment);

            setTask((prev) =>
                prev
                    ? {
                        ...prev,
                        comments: [
                            ...prev.comments,
                            newComment,
                        ],
                    }
                    : null,
            );

            setComment("");

            toast.success("Comment added");
        } catch (error) {
            console.error(
                "Failed to add comment:",
                error,
            );

            toast.error("Failed to add comment");
        }
    };




    // DELETE COMMENT



    const deleteComment = async (commentId: string) => {
        if (!task) return;

        try {
            await commentAPI.deleteComment(
                task.id,
                commentId,
            );

            setTask((prev) =>
                prev
                    ? {
                        ...prev,
                        comments:
                            prev.comments.filter(
                                (item) =>
                                    item.id !==
                                    commentId,
                            ),
                    }
                    : null,
            );

            toast.success("Comment deleted");
        } catch (error) {
            console.error(
                "Failed to delete comment:",
                error,
            );

            toast.error(
                "Failed to delete comment",
            );
        }
    };

    const handleShare =
        async () => {
            try {
                await navigator.clipboard?.writeText(
                    window.location.href,
                );

                toast.success(
                    "Task link copied",
                );
            } catch {
                toast.error(
                    "Unable to copy task link",
                );
            }
        };


    if (loading) {
    return <TaskDetailsSkeleton />;
}

    if (!task) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-lg font-semibold">
                        Task not found
                    </h1>

                    <Link
                        href="/"
                        className="mt-3 inline-block text-sm text-primary hover:underline"
                    >
                        Back to tasks
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="flex h-screen bg-background text-foreground">

            {/* Sidebar */}
            <AppSidebar
                open
                active="tasks"
            />

            {/* Page */}
            <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-background">


                {/* HEADER */}


                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background px-4 py-2.5 md:px-6">

                    <Link
                        href={`/projects/${projectId}/tasks`}
                        aria-label="Back to tasks"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>

                    <span className="text-sm text-muted-foreground">
                        Workspace
                    </span>

                    <span className="text-muted-foreground">
                        /
                    </span>

                    <Link
                        href={`/projects/${projectId}/tasks`}
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        Tasks
                    </Link>

                    <span className="text-muted-foreground">
                        /
                    </span>

                    <span className="truncate text-sm font-medium">
                        {task.title}
                    </span>

                    <div className="ml-auto flex items-center gap-1 text-muted-foreground">

                       
                        <button
                            type="button"
                            aria-label="Share"
                            onClick={handleShare}
                            className="rounded p-1.5 hover:bg-muted"
                        >
                            <Share2 className="size-4" />
                        </button>

                    

                    </div>
                </div>



                {/* CONTENT */}


                <div className="flex flex-1 flex-col gap-6 overflow-auto px-4 py-5 md:flex-row md:px-6">



                    <div className="min-w-0 flex-1 space-y-5">

                        {/* Heading */}
                        <header>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {task.title}
                            </h1>

                            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                {task.description ||
                                    "No description yet."}
                            </p>
                        </header>



                        {/* PROPERTIES */}


                        <div className="rounded-xl border border-border bg-card p-3">

                            <Row label="Properties">

                                {task.reporter && (
                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">

                                        <MemberAvatar
                                            member={
                                                task.reporter
                                            }
                                            className="size-4 text-[8px] ring-0"
                                        />

                                        {
                                            task.reporter.jobTitle

                                        }

                                    </span>
                                )}

                                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">

                                    <CalendarDays className="size-3.5" />

                                    {task.due}

                                </span>

                            </Row>



                            {/* LABELS */}


                            <Row label="Labels">

                                {task.labels.map(
                                    (label) => (
                                        <LabelChip
                                            key={label}
                                        >
                                            {label}
                                        </LabelChip>
                                    ),
                                )}

                                <DropdownMenu>

                                    <DropdownMenuTrigger className="rounded-md border border-dashed border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted">
                                        <Plus className="inline size-3" />
                                        Label
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="start"
                                        className="w-44"
                                    >

                                        {labels.map(
                                            (label) => {

                                                const isSelected =
                                                    task.labels.includes(
                                                        label.name,
                                                    );

                                                return (
                                                    <DropdownMenuItem
                                                        key={label.id}
                                                        className="justify-between"
                                                        onSelect={(
                                                            event,
                                                        ) => {
                                                            event.preventDefault();

                                                            toggleLabel(
                                                                label.name,
                                                            );
                                                        }}
                                                    >
                                                        <span>
                                                            {label.name}
                                                        </span>

                                                        {isSelected && (
                                                            <Check className="size-4 text-primary" />
                                                        )}
                                                    </DropdownMenuItem>
                                                );
                                            },
                                        )}

                                    </DropdownMenuContent>

                                </DropdownMenu>

                            </Row>



                            {/* RESOURCES */}


                            <Row label="Resources">

                                {task.resources.map(
                                    (resource) => (
                                        <div
                                            key={resource}
                                            className="flex max-w-full items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                                        >
                                            <a
                                                href={resource}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="max-w-[220px] truncate text-primary hover:underline"
                                            >
                                                {resource}
                                            </a>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteResource(
                                                        resource,
                                                    )
                                                }
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ),
                                )}

                                <button
                                    type="button"
                                    onClick={
                                        addResource
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                                >
                                    <Paperclip className="size-3.5" />
                                    Add document or link…
                                </button>

                            </Row>

                        </div>



                        {/* SUBTASKS */}


                        <SubtasksSection
                            subtasks={task.subtasks}
                            taskId={taskId}
                            onDeleteSubtask={deleteSubtask}
                        />



                        {/* COMMENTS */}


                        <section className="rounded-xl border border-border bg-card p-3">

                            <h2 className="mb-3 text-sm font-semibold">
                                Comments
                            </h2>

                            <ul className="space-y-3">

                                {task.comments.map(
                                    (commentItem) => (
                                        <li
                                            key={
                                                commentItem.id
                                            }
                                            className="flex gap-2"
                                        >

                                            <MemberAvatar
                                                member={
                                                    commentItem.author ?? {
                                                        id: "",
                                                        username: "Unknown",
                                                        avatar: "",
                                                        email: "",
                                                    }
                                                }
                                            />

                                            <div className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2">

                                                <div className="flex items-center gap-2 text-xs">

                                                    <span className="font-semibold">
                                                        {commentItem.author?.username ?? "Unknown"}
                                                    </span>

                                                    <span className="text-muted-foreground">
                                                        {
                                                            commentItem.at
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        aria-label="Delete comment"
                                                        onClick={() =>
                                                            deleteComment(
                                                                commentItem.id,
                                                            )
                                                        }
                                                        className="ml-auto rounded p-0.5 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>

                                                </div>

                                                <p className="mt-1 text-sm">
                                                    {
                                                        commentItem.body
                                                    }
                                                </p>

                                            </div>

                                        </li>
                                    ),
                                )}

                                {task.comments
                                    .length === 0 && (
                                        <li className="text-xs text-muted-foreground">
                                            No updates yet.
                                        </li>
                                    )}

                            </ul>


                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    addComment();
                                }}
                                className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-1.5"
                            >

                                <input
                                    value={comment}
                                    onChange={(event) =>
                                        setComment(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="Add a comment…"
                                    className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        !comment.trim()
                                    }
                                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40"
                                >
                                    <Send className="size-4" />
                                </button>

                            </form>

                        </section>

                    </div>



                    {/* DETAILS */}


                    <aside className="w-full shrink-0 md:w-72">

                        <div className="rounded-xl border border-border bg-card">

                            <div className="flex items-center gap-2 border-b border-border px-3 py-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setDetailsOpen(
                                            (open) =>
                                                !open,
                                        )
                                    }
                                    className="flex items-center gap-2 text-sm font-semibold"
                                >

                                    <ChevronDown
                                        className={cn(
                                            "size-4 transition-transform",
                                            !detailsOpen &&
                                            "-rotate-90",
                                        )}
                                    />

                                    Details

                                </button>


                            </div>


                            {detailsOpen && (
                                <div className=" p-2">


                                    {/* STATUS */}


                                    <Row label="Status">

                                        <DropdownMenu>

                                            <DropdownMenuTrigger className="rounded-md px-2 py-1 text-xs font-medium text-priority-medium hover:bg-muted">
                                                {task.status.replace(/_/g, " ")}
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="start">

                                                {statusOptions.map(
                                                    (status) => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            onSelect={() =>
                                                                updateTask(
                                                                    {
                                                                        status,
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            {status}
                                                        </DropdownMenuItem>
                                                    ),
                                                )}

                                            </DropdownMenuContent>

                                        </DropdownMenu>

                                    </Row>



                                    {/* GROUP */}


                                    <Row label="Group">

                                        <DropdownMenu>

                                            <DropdownMenuTrigger className="rounded-md px-2 py-1 text-xs font-medium hover:bg-muted">
                                                {task.group.replace(/_/g, " ")}
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="start">

                                                {groups.map(
                                                    (group) => (
                                                        <DropdownMenuItem
                                                            key={
                                                                group.id
                                                            }
                                                            onSelect={() =>
                                                                updateTask(
                                                                    {
                                                                        group:
                                                                            group.id,
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            {
                                                                group.name
                                                            }
                                                        </DropdownMenuItem>
                                                    ),
                                                )}

                                            </DropdownMenuContent>

                                        </DropdownMenu>

                                    </Row>



                                    {/* PRIORITY */}


                                    <Row label="Priority">

                                        <DropdownMenu>

                                            <DropdownMenuTrigger className="rounded-md px-2 py-1 hover:bg-muted">

                                                <PriorityTag
                                                    priority={
                                                        task.priority
                                                    }
                                                />

                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="start"
                                                className="w-40"
                                            >

                                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                                    Priority
                                                </DropdownMenuLabel>

                                                <DropdownMenuSeparator />

                                                {priorities.map(
                                                    (priority) => (
                                                        <DropdownMenuItem
                                                            key={
                                                                priority
                                                            }
                                                            className="justify-between"
                                                            onSelect={() =>
                                                                updateTask(
                                                                    {
                                                                        priority:
                                                                            priority as TaskPriority,
                                                                    },
                                                                )
                                                            }
                                                        >

                                                            <PriorityTag
                                                                priority={
                                                                    priority
                                                                }
                                                            />

                                                            {task.priority ===
                                                                priority && (
                                                                    <Check className="size-4 text-primary" />
                                                                )}

                                                        </DropdownMenuItem>
                                                    ),
                                                )}

                                            </DropdownMenuContent>

                                        </DropdownMenu>

                                    </Row>



                                    {/* MEMBERS */}


                                    <Row label="Members">
                                        <MemberStack members={task.members} />

                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="rounded-md border border-dashed border-border px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted">
                                                <Plus className="inline size-3" />
                                                Add
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="start"
                                                className="w-44"
                                            >
                                                {members.map((member) => {
                                                    const memberName =
                                                        member.username ?? member.name;

                                                    const selected = task.members.some(
                                                        (item) =>
                                                            String(item.id) === String(member.id),
                                                    );

                                                    return (
                                                        <DropdownMenuItem
                                                            key={member.id}
                                                            className="justify-between"
                                                            onSelect={(event) => {
                                                                event.preventDefault();

                                                                toggleMember({
                                                                    id: member.id,
                                                                    username: member.username ?? member.name,
                                                                    avatar: member.avatar,
                                                                    email: member.email,
                                                                });
                                                            }}
                                                        >
                                                            <span>{memberName}</span>

                                                            {selected && (
                                                                <Check className="size-4 text-primary" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    );
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </Row>



                                    {/* DUE DATE */}


                                    <Row label="End Dates">

                                        <Popover>

                                            <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium hover:bg-muted">

                                                <CalendarDays className="size-3.5 text-muted-foreground" />

                                                {task.due}

                                            </PopoverTrigger>

                                            <PopoverContent
                                                align="start"
                                                className="w-auto p-0"
                                            >

                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        task.dueDate
                                                            ? new Date(
                                                                task.dueDate,
                                                            )
                                                            : undefined
                                                    }

                                                   
                                                    onSelect={(
                                                        date,
                                                    ) => {
                                                        if (!date)
                                                            return;

                                                        updateTask(
                                                            {
                                                                dueDate:
                                                                    date.toISOString(),
                                                                due: formatDate(
                                                                    date.toISOString(),
                                                                ),
                                                                dueShort:
                                                                    formatDate(
                                                                        date.toISOString(),
                                                                    ),
                                                            },
                                                        );
                                                    }}
                                                />

                                            </PopoverContent>

                                        </Popover>

                                    </Row>



                                    {/* REPORTER */}


                                    <Row label="Reporter">

                                        {task.reporter && (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium">

                                                <MemberAvatar
                                                    member={
                                                        task.reporter
                                                    }
                                                    className="size-5 text-[9px]"
                                                />

                                                {
                                                    task
                                                        .reporter
                                                        .username
                                                }

                                            </span>
                                        )}

                                    </Row>

                                </div>
                            )}

                        </div>

                        <Updates activities={userActivity} />

                    </aside>

                </div>

            </div>

        </div>
    );
}