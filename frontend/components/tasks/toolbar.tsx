"use client";
import { useState } from "react";
import {
  PanelLeft,
  Search,
  SlidersHorizontal,
  ListFilter,
  Plus,
  Rows3,
  Columns3,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldOptions, priorities,  TaskPriority } from "@/lib/tasks-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ViewMode = "list" | "board";

export function Toolbar({
  view,
  onViewChange,
  onToggleSidebar,
  query,
  onQueryChange,
  onAddTask,
  fields,
  onToggleField,
  priorityFilter,
  onPriorityFilterChange,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onToggleSidebar: () => void;
  query: string;
  onQueryChange: (v: string) => void;
  onAddTask: () => void;
  fields: string[];
  onToggleField: (f: string) => void;
  priorityFilter: TaskPriority | "All";
  onPriorityFilterChange: (p: TaskPriority | "All") => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 bg-background">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 md:px-6">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <PanelLeft className="size-4" />
        </button>
        <span className="text-sm text-muted-foreground">Workspace</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Tasks</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 py-3 md:px-6">
        <h1 className="mr-auto text-lg font-semibold tracking-tight">Tasks</h1>

        <div
          className={cn(
            "flex items-center gap-1.5 rounded-md border border-border px-2 transition-all",
            searchOpen ? "w-48 bg-card" : "w-8 border-transparent",
          )}
        >
          <button
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search tasks"
            className="py-1.5 text-muted-foreground hover:text-foreground"
          >
            <Search className="size-4" />
          </button>
          {searchOpen && (
            <input
              autoFocus
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search tasks"
              className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            Fields
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Visible fields
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {fieldOptions.map((f) => (
              <DropdownMenuItem
                key={f}
                onSelect={(e) => {
                  e.preventDefault();
                  onToggleField(f);
                }}
                className="justify-between"
              >
                {f}
                {fields.includes(f) && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Filter tasks"
            className={cn(
              "rounded-md border border-border bg-card p-1.5 transition-colors hover:bg-muted",
              priorityFilter !== "All"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ListFilter className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Filter by priority
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(["All", ...priorities] as const).map((p) => (
              <DropdownMenuItem
                key={p}
                className="justify-between"
                onSelect={() => onPriorityFilterChange(p as TaskPriority | "All")}
              >
                {p}
                {priorityFilter === p && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center rounded-md border border-border bg-muted p-0.5">
          {(
            [
              { id: "list", label: "List", Icon: Rows3 },
              { id: "board", label: "Board", Icon: Columns3 },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-sm font-medium transition-colors",
                view === id
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={onAddTask}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Add Task
        </button>
      </div>
    </div>
  );
}
