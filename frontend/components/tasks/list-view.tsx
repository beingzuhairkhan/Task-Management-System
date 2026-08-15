"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { groups } from "@/lib/tasks-data";
import { useTasks } from "@/lib/tasks-store";
import { normalizePriority } from './board-view'
import {
  GroupDot,
  LabelChip,
  MemberAvatar,
  MemberStack,
  PriorityTag,
} from "./primitives";

import { TaskMenu } from "./task-menu";
import type { TaskDialogState } from "./task-dialog";
import { TaskListSkeleton } from "./TaskListSkeleton";

type ListViewProps = {
  onDialog: (state: TaskDialogState) => void;
  fields: string[];
};

export function ListView({
  onDialog,
  fields,
}: ListViewProps) {
  const { tasks: allTasks, loading } = useTasks();

  const [collapsed, setCollapsed] =
    useState<Record<string, boolean>>({});

  const show = (field: string) =>
    fields.includes(field);

  const colCount =
    2 +
    [
      "Priority",
      "Members",
      "Due Date",
      "Labels",
      "Status",
      "Reporter",
    ].filter(show).length;

  if (loading) {
    return <TaskListSkeleton />;
  }

  return (
    <div className="space-y-6 p-4">
      {groups.map((group) => {
        const isOpen = !collapsed[group.id];

        const normalizedGroupId = String(group.id)
          .toUpperCase()
          .replace(/-/g, "_");

        const groupTasks = allTasks.filter((task: any) => {
          const taskGroup = String(
            task.group ?? task.groupId ?? "",
          )
            .toUpperCase()
            .replace(/-/g, "_");

          return taskGroup === normalizedGroupId;
        });

        return (
          <section key={group.id}>
            {/* Group Header */}
            <button
              type="button"
              onClick={() =>
                setCollapsed((current) => ({
                  ...current,
                  [group.id]: isOpen,
                }))
              }
              className="mb-2 flex items-center gap-2 rounded-md px-1 py-1 text-sm font-semibold transition-colors hover:text-muted-foreground"
            >
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  !isOpen && "-rotate-90",
                )}
              />

              <GroupDot tone={group.tone} />

              <span>{group.name}</span>

              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {groupTasks.length}
              </span>
            </button>

            {/* Table */}
            {isOpen && (
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface text-left text-xs text-muted-foreground">
                      {/* Task */}
                      <th className="px-4 py-2.5 font-medium">
                        Task
                      </th>

                      {/* Priority */}
                      {show("Priority") && (
                        <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                          Priority
                        </th>
                      )}

                      {/* Members */}
                      {show("Members") && (
                        <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                          Members
                        </th>
                      )}

                      {/* Status */}
                      {show("Status") && (
                        <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                          Status
                        </th>
                      )}

                      {/* Labels */}
                      {show("Labels") && (
                        <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                          Labels
                        </th>
                      )}

                      {/* Reporter */}
                      {show("Reporter") && (
                        <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                          Reporter
                        </th>
                      )}

                      {/* Due Date */}
                      {show("Due Date") && (
                        <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                          Due Date
                        </th>
                      )}

                      {/* Actions */}
                      <th className="w-12 px-4 py-2.5 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {groupTasks.map((task: any) => (
                      <tr
                        key={task.id ?? task._id}
                        className="border-b border-border last:border-0 hover:bg-surface"
                      >
                        {/* Task */}
                        <td className="px-4 py-2.5 font-medium">
                          <Link
                            href={`/task/${task.id ?? task._id}`}
                            className="hover:underline"
                          >
                            {task.title}
                          </Link>
                        </td>

                        {/* Priority */}
                        {show("Priority") && (
                          <td className="hidden px-4 py-2.5 sm:table-cell">
                            <PriorityTag
                              priority={normalizePriority(task.priority)}
                            />
                          </td>
                        )}

                        {/* Members */}
                        {show("Members") && (
                          <td className="hidden px-4 py-2.5 sm:table-cell">
                            <MemberStack
                              members={
                                task.members ?? []
                              }
                            />
                          </td>
                        )}

                        {/* Status */}
                        {show("Status") && (
                          <td className="hidden px-4 py-2.5 md:table-cell">
                            <LabelChip
                              status={
                                task.status ?? ""
                              }
                            >
                              {String(
                                task.status ?? "",
                              ).replace(
                                /_/g,
                                " ",
                              )}
                            </LabelChip>
                          </td>
                        )}

                        {/* Labels */}
                        {show("Labels") && (
                          <td className="hidden px-4 py-2.5 md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {(task.labels ?? [])
                                .slice(0, 2)
                                .map(
                                  (
                                    label: any,
                                    index: number,
                                  ) => {
                                    const labelKey =
                                      typeof label ===
                                        "string"
                                        ? label
                                        : label.id ??
                                        label._id ??
                                        index;

                                    const labelName =
                                      typeof label ===
                                        "string"
                                        ? label
                                        : label.name;

                                    return (
                                      <LabelChip
                                        key={
                                          labelKey
                                        }
                                      >
                                        {
                                          labelName
                                        }
                                      </LabelChip>
                                    );
                                  },
                                )}

                              {(task.labels ?? [])
                                .length > 2 && (
                                  <LabelChip>
                                    +
                                    {(task.labels ?? [])
                                      .length - 2}
                                  </LabelChip>
                                )}
                            </div>
                          </td>
                        )}

                        {/* Reporter */}
                        {show("Reporter") && (
                          <td className="hidden px-4 py-2.5 md:table-cell">
                            {task.reporter && (
                              <MemberAvatar
                                member={
                                  task.reporter
                                }
                              />
                            )}
                          </td>
                        )}

                        {/* Due Date */}
                        {show("Due Date") && (
                          <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">
                            {task.dueDate ? (
                              new Date(
                                task.dueDate,
                              ).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            ) : (
                              "No due date"
                            )}
                          </td>
                        )}

                        {/* Actions */}
                        <td className="px-4 py-2.5 text-right">
                          <TaskMenu
                            task={task}
                            onEdit={() =>
                              onDialog({
                                mode: "edit",
                                task,
                              })
                            }
                          />
                        </td>
                      </tr>
                    ))}

                    {/* Empty State */}
                    {groupTasks.length === 0 && (
                      <tr>
                        <td
                          colSpan={colCount}
                          className="px-4 py-6 text-center text-sm text-muted-foreground"
                        >
                          Nothing here yet.
                        </td>
                      </tr>
                    )}

                    {/* Add Task */}
                    <tr>
                      <td
                        colSpan={colCount}
                        className="px-2 py-1.5"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onDialog({
                              mode: "create",
                              groupId:
                                group.id,
                            })
                          }
                          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Plus className="size-4" />
                          Add task
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}