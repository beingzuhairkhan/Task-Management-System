"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/tasks/app-sidebar";
import {
  Toolbar,
  type ViewMode,
} from "@/components/tasks/toolbar";

import { BoardView } from "@/components/tasks/board-view";
import { ListView } from "@/components/tasks/list-view";

import {
  TaskDialog,
  type TaskDialogState,
} from "@/components/tasks/task-dialog";

import { useTasks } from "@/lib/tasks-store";

export default function DashboardPage() {
  const [view, setView] =
    useState<ViewMode>("board");

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [dialog, setDialog] =
    useState<TaskDialogState | null>(null);

  const [fields, setFields] = useState<string[]>([
    "Priority",
    "Members",
    "Due Date",
    "Labels",
  ]);

  const {
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    fetchTasks
  } = useTasks();

  const toggleField = (field: string) => {
    setFields((previous) =>
      previous.includes(field)
        ? previous.filter(
            (item) => item !== field,
          )
        : [...previous, field],
    );
  };

  const handleAddTask = () => {
    setDialog({
      mode: "create",
      groupId: "todo",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        open={sidebarOpen}
        active="tasks"
      />

      <main className="min-w-0 flex-1">
        <Toolbar
          view={view}
          onViewChange={setView}
          onToggleSidebar={() =>
            setSidebarOpen(
              (open) => !open,
            )
          }

          query={search}
          onQueryChange={setSearch}

          onAddTask={handleAddTask}

          fields={fields}
          onToggleField={toggleField}

          priorityFilter={
            priorityFilter
          }
          onPriorityFilterChange={
            setPriorityFilter
          }

          statusFilter={statusFilter}
          onStatusFilterChange={
            setStatusFilter
          }
        />

        {view === "board" ? (
          <BoardView
            onDialog={setDialog}
            fields={fields}
          />
        ) : (
          <ListView
            onDialog={setDialog}
            fields={fields}
          />
        )}

        <TaskDialog
          state={dialog}
          onOpenChange={(open) => {
            if (!open) {
              setDialog(null);
            }
          }}
          onSuccess={fetchTasks}
        />
      </main>
    </div>
  );
}