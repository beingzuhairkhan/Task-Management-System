
"use client";

import Link from "next/link";

import {
  Plus,
  CalendarDays,
} from "lucide-react";

import {
  groups,
  type Priority,
} from "@/lib/tasks-data";

import { useTasks } from "@/lib/tasks-store";
import { getAvatarOrInitials } from "@/lib/profile-store"
import {
  GroupDot,
  LabelChip,
  MemberStack,
  PriorityTag,
} from "./primitives";

import { TaskMenu } from "./task-menu";
import type { TaskDialogState } from "./task-dialog";
import { useParams } from "next/navigation";
type BoardViewProps = {
  query: string;
  onDialog: (state: TaskDialogState) => void;
  fields: string[];
  priorityFilter: Priority | "All";
};

export function BoardView({
  query,
  onDialog,
  fields,
  priorityFilter,
}: BoardViewProps) {
  const { tasks: allTasks, loading } = useTasks();
  const params = useParams<{ projectId: string }>();

  const projectId = params.projectId;
  const q = query.trim().toLowerCase();

  const show = (field: string) =>
    fields.includes(field);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
        Loading tasks...
      </div>
    );
  }

  return (
    <div>

      {/* Board */}
      <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 p-6">
        {groups.map((group) => {

          const normalizedGroupId = group.id
            .toUpperCase()
            .replace("-", "_");

          const tasks = allTasks.filter((task: any) => {
            const taskGroup = String(
              task.group ?? task.groupId ?? "",
            )
              .toUpperCase()
              .replace("-", "_");

            const matchesGroup =
              taskGroup === normalizedGroupId;

            const matchesQuery = q
              ? String(task.title ?? "")
                .toLowerCase()
                .includes(q)
              : true;

            const matchesPriority =
              priorityFilter === "All"
                ? true
                : task.priority === priorityFilter;

            return (
              matchesGroup &&
              matchesQuery &&
              matchesPriority
            );
          });

          return (
            <section
              key={group.id}
              className="min-w-0 rounded-xl border border-border bg-muted/30"
            >
              {/* Group Header */}
              <div className="flex items-center gap-2  px-3 py-2.5">
                <GroupDot groupId={group.id} />

                <h2 className="text-sm font-semibold">
                  {group.name}
                </h2>

                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {tasks.length}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onDialog({
                      mode: "create",
                      groupId: group.id,
                    })
                  }
                  aria-label={`Add task to ${group.name}`}
                  className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-2 px-2 pb-2 pt-2">
                {tasks.map((task: any) => (
                  <article
                    key={task.id}
                    className="group rounded-lg border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-panel"
                  >
                    {/* Title + Menu */}
                    <div className="flex items-start gap-2">
                      <Link
                      href={`/projects/${projectId}/tasks/${task.id}`}
                        className="flex-1 text-sm font-medium leading-snug hover:underline"
                      >
                        {task.title}
                      </Link>

                      <TaskMenu
                        task={task}
                        onEdit={() =>
                          onDialog({
                            mode: "edit",
                            task,
                          })
                        }
                        className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                      />
                    </div>

                    {/* Members + Due Date */}
                    {(show("Members") || show("Due Date") || show("Reporter")) && (
                      <div className="flex w-full items-center justify-between">
                        {/* Left */}
                        {show("Members") && (
                          <div className="left-0">
                            <MemberStack
                              members={(task.members ?? []).map((member: any) => ({
                                id: member.id,
                                username: member.username,
                                email: member.email,
                                avatar: member.avatar,
                              }))}
                            />
                          </div>
                        )}

                        {/* Right */}
                        {(show("Reporter") || show("Due Date")) && (
                          <div className="ml-auto flex items-center gap-2">
                            {show("Reporter") && task.reporter && (
                              <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-avatar-violet text-[10px] font-bold text-avatar-violet-foreground">
                                {(() => {
                                  const avatar = getAvatarOrInitials(
                                    task.reporter.username,
                                    task.reporter.avatar,
                                  );

                                  return task.reporter.avatar?.trim() ? (
                                    <img
                                      src={avatar}
                                      alt={task.reporter.username}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    avatar
                                  );
                                })()}
                              </span>
                            )}

                            {show("Due Date") && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                                <CalendarDays className="size-3" />
                                {task.dueDate
                                  ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                  : "No due date"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Priority + Status + Labels */}
                    {(show("Priority") ||
                      show("Labels") ||
                      show("Status")) && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-border pt-2.5">
                          {show("Priority") && (
                            <PriorityTag
                            priority={task.priority.replace(/_/g, " ")}
                            />
                          )}

                          {show("Status") && (
                            <LabelChip>
                              {task.status}
                            </LabelChip>
                          )}

                          {show("Labels") &&
                            (task.labels ?? [])
                              .slice(0, 3)
                              .map(
                                (label: any) => (
                                  <LabelChip
                                    key={
                                      typeof label ===
                                        "string"
                                        ? label
                                        : label.id
                                    }
                                  >
                                    {typeof label ===
                                      "string"
                                      ? label
                                      : label.name}
                                  </LabelChip>
                                ),
                              )}
                        </div>
                      )}
                  </article>
                ))}

                {/* Add Task */}
                <button
                  type="button"
                  onClick={() =>
                    onDialog({
                      mode: "create",
                      groupId: group.id,
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="size-4" />
                  Add task
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}


