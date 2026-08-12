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

import type { Priority } from "@/lib/tasks-data";

export default function DashboardPage() {
  const [view, setView] =
    useState<ViewMode>("board");

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [query, setQuery] =
    useState("");

  const [dialog, setDialog] =
    useState<TaskDialogState | null>(null);

  const [fields, setFields] = useState<string[]>([
    "Priority",
    "Members",
    "Due Date",
    "Labels",
  ]);

  const [priorityFilter, setPriorityFilter] =
    useState<Priority | "All">("All");

  const toggleField = (field: string) => {
    setFields((previous) =>
      previous.includes(field)
        ? previous.filter((item) => item !== field)
        : [...previous, field]
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
      {/* Sidebar */}
      <AppSidebar
        open={sidebarOpen}
        active="tasks"
      />

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {/* Toolbar */}
        <Toolbar
          view={view}
          onViewChange={setView}
          onToggleSidebar={() =>
            setSidebarOpen((open) => !open)
          }
          query={query}
          onQueryChange={setQuery}
          onAddTask={handleAddTask}
          fields={fields}
          onToggleField={toggleField}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={
            setPriorityFilter
          }
        />

        {/* Board / List */}
        {view === "board" ? (
          <BoardView
            query={query}
            onDialog={setDialog}
            fields={fields}
            priorityFilter={priorityFilter}
          />
        ) : (
          <ListView
            query={query}
            onDialog={setDialog}
            fields={fields}
            priorityFilter={priorityFilter}
          />
        )}

        {/* Task Dialog */}
        <TaskDialog
          state={dialog}
          onOpenChange={(open) => {
            if (!open) {
              setDialog(null);
            }
          }}
        />
      </main>
    </div>
  );
}