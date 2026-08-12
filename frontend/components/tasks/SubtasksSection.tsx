"use client";

import { useState } from "react";
import {
    Check,
    ChevronDown,
    Plus,
    Trash2,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MemberStack,
    PriorityTag,
} from "@/components/tasks/primitives";

import {
    ProjectDialog,
    type ProjectDialogState,
} from "@/components/projects/project-dialog";

import type {
    SubtasksSectionProps,
    Priority,
    Subtask,
} from "@/lib/tasks-data";

import {
    priorities,
} from "@/lib/tasks-data";

import { formatDate } from "@/lib/date-utils";
import { subTaskAPI } from "@/services/api";
import { toast } from "sonner";
import { projectStatuses } from "@/lib/projects-store";



function formatStatus(status?: string) {
    if (!status) {
        return "Unknown";
    }

    return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}



export function SubtasksSection({
    subtasks,
    taskId,
    onDeleteSubtask,
    onUpdateSubtask,
}: SubtasksSectionProps) {

    const [dialog, setDialog] =
        useState<ProjectDialogState | null>(null);

    const [updatingSubtaskId, setUpdatingSubtaskId] =
        useState<string | null>(null);



    const handleAddSubtask = () => {
        setDialog({
            mode: "create",
            type: "subtask",
        });
    };


    const updateSubtask = async (
        subtaskId: string,
        data: {
            status?: string;
            priority?: string;
        },
    ) => {

        try {

            setUpdatingSubtaskId(subtaskId);



            const payload: {
                status?: string;
                priority?: string;
            } = {};


            if (data.status) {
                payload.status = data.status
                    .toUpperCase()
                    .replace(/\s+/g, "_");
            }


            if (data.priority) {
                payload.priority = data.priority
                    .toUpperCase()
                    .replace(/\s+/g, "_");
            }



            await subTaskAPI.updateSubTaskById(
                taskId,
                subtaskId,
                payload,
            );

            onUpdateSubtask?.(
                subtaskId,
                payload,
            );


            toast.success(
                "Subtask updated",
            );

        } catch (error) {


            toast.error(
                "Failed to update subtask",
            );

        } finally {

            setUpdatingSubtaskId(null);

        }
    };


    return (
        <section className="rounded-xl border border-border bg-card">

           

            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">

                <ChevronDown
                    className="size-4 text-muted-foreground"
                />

                <h2 className="text-sm font-semibold">
                    Subtasks
                </h2>

                <span className="rounded-full bg-muted px-1.5 text-xs text-muted-foreground">
                    {subtasks.length}
                </span>

            </div>


    

            <div className="overflow-x-auto">

                <table className="w-full text-sm">


                    <thead>

                        <tr className="border-b border-border bg-surface text-left text-xs text-muted-foreground">

                            <th className="px-3 py-2 font-medium">
                                Task
                            </th>

                            <th className="hidden px-3 py-2 font-medium sm:table-cell">
                                Status
                            </th>

                            <th className="hidden px-3 py-2 font-medium sm:table-cell">
                                Priority
                            </th>

                            <th className="hidden px-3 py-2 font-medium sm:table-cell">
                                Member
                            </th>

                            <th className="hidden px-3 py-2 font-medium md:table-cell">
                                Due Date
                            </th>

                            <th className="w-12 px-3 py-2 text-right font-medium">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        {subtasks.length === 0 && (
                            <tr>

                                <td
                                    colSpan={6}
                                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                                >
                                    No subtasks yet.
                                </td>

                            </tr>
                        )}



                        {subtasks.map((subtask) => {

                            const isUpdating =
                                updatingSubtaskId ===
                                subtask.id;


                            return (
                                <tr
                                    key={subtask.id}
                                    className="border-b border-border last:border-0 hover:bg-surface"
                                >

                                  

                                    <td className="px-3 py-2">

                                        <span className="font-medium">
                                            {subtask.title}
                                        </span>

                                    </td>


                                  

                                    <td className="hidden px-3 py-2 sm:table-cell">

                                        <DropdownMenu>

                                            <DropdownMenuTrigger
                                                asChild
                                            >

                                                <button
                                                    type="button"
                                                    disabled={isUpdating}
                                                    className="inline-flex min-w-[120px] items-center justify-between gap-2 rounded-md bg-muted px-2 py-1 text-xs font-medium hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
                                                >

                                                    <span>
                                                        {formatStatus(
                                                            subtask.status,
                                                        )}
                                                    </span>

                                                    <ChevronDown className="size-3.5" />

                                                </button>

                                            </DropdownMenuTrigger>


                                            <DropdownMenuContent
                                                align="start"
                                            >

                                                {projectStatuses.map(
                                                    (status) => {

                                                        const normalizedStatus =
                                                            status
                                                                .toUpperCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "_",
                                                                );


                                                        return (
                                                            <DropdownMenuItem
                                                                key={status}
                                                                onSelect={() => {

                                                                    if (
                                                                        normalizedStatus ===
                                                                        subtask.status
                                                                    ) {
                                                                        return;
                                                                    }


                                                                    updateSubtask(
                                                                        subtask.id,
                                                                        {
                                                                            status:
                                                                                normalizedStatus,
                                                                        },
                                                                    );

                                                                }}
                                                            >

                                                                <span className="flex-1">
                                                                    {formatStatus(
                                                                        status,
                                                                    )}
                                                                </span>


                                                                {subtask.status ===
                                                                    normalizedStatus && (
                                                                    <Check className="size-4 text-primary" />
                                                                )}

                                                            </DropdownMenuItem>
                                                        );
                                                    },
                                                )}

                                            </DropdownMenuContent>

                                        </DropdownMenu>

                                    </td>


                                   

                                    <td className="hidden px-3 py-2 sm:table-cell">

                                        <DropdownMenu>

                                            <DropdownMenuTrigger
                                                asChild
                                            >

                                                <button
                                                    type="button"
                                                    disabled={isUpdating}
                                                    className="rounded-md p-1 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                                >

                                                    <PriorityTag
                                                        priority={
                                                            subtask.priority as Priority
                                                        }
                                                    />

                                                </button>

                                            </DropdownMenuTrigger>


                                            <DropdownMenuContent
                                                align="start"
                                            >

                                                <DropdownMenuSeparator />


                                                {priorities.map(
                                                    (priority) => {

                                                        const normalizedPriority =
                                                            priority
                                                                .toUpperCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "_",
                                                                );


                                                        return (
                                                            <DropdownMenuItem
                                                                key={priority}
                                                                className="justify-between gap-4"
                                                                onSelect={() => {

                                                                    if (
                                                                        normalizedPriority ===
                                                                        subtask.priority
                                                                    ) {
                                                                        return;
                                                                    }


                                                                    updateSubtask(
                                                                        subtask.id,
                                                                        {
                                                                            priority:
                                                                                normalizedPriority,
                                                                        },
                                                                    );

                                                                }}
                                                            >

                                                                <PriorityTag
                                                                    priority={
                                                                        normalizedPriority as Priority
                                                                    }
                                                                />


                                                                {subtask.priority ===
                                                                    normalizedPriority && (
                                                                    <Check className="size-4 text-primary" />
                                                                )}

                                                            </DropdownMenuItem>
                                                        );
                                                    },
                                                )}

                                            </DropdownMenuContent>

                                        </DropdownMenu>

                                    </td>



                                    <td className="hidden px-3 py-2 sm:table-cell">

                                        {subtask.subMember ? (

                                            <MemberStack
                                                members={[
                                                    subtask.subMember,
                                                ]}
                                            />

                                        ) : (

                                            <span className="text-xs text-muted-foreground">
                                                No member
                                            </span>

                                        )}

                                    </td>


                                 

                                    <td className="hidden px-3 py-2 text-muted-foreground md:table-cell">

                                        {subtask.dueDate
                                            ? formatDate(
                                                subtask.dueDate,
                                            )
                                            : "No due date"}

                                    </td>



                                    <td className="px-3 py-2 text-right">

                                        <button
                                            type="button"
                                            aria-label={`Delete ${subtask.title}`}
                                            onClick={() =>
                                                onDeleteSubtask(
                                                    subtask.id,
                                                )
                                            }
                                            disabled={isUpdating}
                                            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            <Trash2 className="size-4" />

                                        </button>

                                    </td>

                                </tr>
                            );
                        })}


                

                        <tr>

                            <td
                                colSpan={6}
                                className="px-2 py-2"
                            >

                                <button
                                    type="button"
                                    onClick={handleAddSubtask}
                                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                >

                                    <Plus className="size-4" />

                                    Add subtask

                                </button>



                                <ProjectDialog
                                    state={dialog}
                                    onOpenChange={(open) => {

                                        if (!open) {
                                            setDialog(null);
                                        }

                                    }}
                                    createSubTask={true}
                                    taskId={taskId}
                                />

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </section>
    );
}