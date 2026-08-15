'use client';

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  PanelLeft,
  Search,
  SlidersHorizontal,
  ListFilter,
  Plus,
  Check,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { AppSidebar } from "@/components/tasks/app-sidebar";
import { MemberAvatar, PriorityTag } from "@/components/tasks/primitives";
import {
  ProjectDialog,
  type ProjectDialogState,
} from "@/components/projects/project-dialog";

import { useProjects, ProjectStatus, projectStatuses } from "@/lib/projects-store";
import { priorities, TaskPriority } from "@/lib/tasks-data";
import { cn } from "@/lib/utils";
import { projectAPI } from "@/services/api";
import type { ProjectPriority } from "@/services/api";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ProjectsSkeleton } from "@/components/projects/ProjectsSkeleton"
const columns = ["Priority", "Lead", "Status", "Due Date"] as const;

type Column = (typeof columns)[number];

export default function ProjectsPage() {
  const { deleteProject } = useProjects();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [visible, setVisible] = useState<Column[]>([...columns]);

  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriority | "All">("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [dialog, setDialog] =
    useState<ProjectDialogState | null>(null);
  const router = useRouter();

  const shown = (c: Column) => visible.includes(c);

  const toggle = (c: Column) =>
    setVisible((prev) =>
      prev.includes(c)
        ? prev.filter((x) => x !== c)
        : [...prev, c],
    );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);

      const response = await projectAPI.findAllProject({
        search: debouncedQuery.trim() || undefined,

        priority:
          priorityFilter === "All"
            ? undefined
            : (priorityFilter
              .toUpperCase()
              .replace(/\s+/g, "_") as ProjectPriority),

        status:
          statusFilter === "All"
            ? undefined
            : (statusFilter.toUpperCase() as ProjectStatus),
      });

      const apiProjects = response.data?.data ?? [];

      const formattedProjects = apiProjects.map((project: any) => ({
        ...project,

        id: project.id ?? project._id,

        name: project.name ?? project.title,

        due:
          project.due ??
          (project.dueDate
            ? new Date(project.dueDate).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              },
            )
            : "No due date"),

        lead: project.lead,

        priority:
          project.priority === "NO_PRIORITY"
            ? "NO_PRIORITY"
            : project.priority,
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedQuery,
    priorityFilter,
    statusFilter,
  ]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const normalizedPriority =
      priorityFilter === "All"
        ? null
        : priorityFilter.toUpperCase().replace(/\s+/g, "_");

    const normalizedStatus =
      statusFilter === "All"
        ? null
        : statusFilter.toUpperCase();

    return projects.filter((p) => {
      const matchesSearch = q
        ? p.name?.toLowerCase().includes(q)
        : true;

      const matchesPriority = normalizedPriority
        ? p.priority === normalizedPriority
        : true;

      const matchesStatus = normalizedStatus
        ? p.status === normalizedStatus
        : true;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [
    projects,
    query,
    priorityFilter,
    statusFilter,
  ]);

  const filtersActive =
    priorityFilter !== "All" ||
    statusFilter !== "All";

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);

      await fetchProjects();

      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);

      toast.error("Failed to delete project");
    }
  };


  return (
    <div className="flex min-h-screen">
      <AppSidebar open
        active="projects" />

      <main className="flex-1">
        <div className="border-b border-border">
          <div className="flex items-center px-4 py-2 md:px-6">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <PanelLeft className="size-4" />
            </button>

            <div className="ml-3 text-sm text-muted-foreground">
              Workspace
              <span className="mx-2">/</span>
              Projects
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 md:px-6">
          <h1 className="mr-auto text-lg font-semibold tracking-tight">
            Projects
          </h1>

          <div
            className={cn(
              "flex items-center gap-1.5 rounded-md border border-border px-2 transition-all",
              searchOpen
                ? "w-48 bg-card"
                : "w-8 border-transparent",
            )}
          >
            <button
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search projects"
              className="py-1.5 text-muted-foreground hover:text-foreground"
            >
              <Search className="size-4" />
            </button>

            {searchOpen && (
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects"
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

              {columns.map((c) => (
                <DropdownMenuItem
                  key={c}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggle(c);
                  }}
                  className="justify-between"
                >
                  {c}

                  {shown(c) && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Filter projects"
              className={cn(
                "rounded-md border border-border bg-card p-1.5 transition-colors hover:bg-muted",
                filtersActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ListFilter className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Priority
              </DropdownMenuLabel>

              {(["All", ...priorities] as const).map((p) => (
                <DropdownMenuItem
                  key={p}
                  className="justify-between"
                  onSelect={() =>
                    setPriorityFilter(
                      p as any | "All",
                    )
                  }
                >
                  {p}

                  {priorityFilter === p && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Status
              </DropdownMenuLabel>

              {(["All", ...projectStatuses] as const).map(
                (s) => (
                  <DropdownMenuItem
                    key={s}
                    className="justify-between"
                    onSelect={() => setStatusFilter(s)}
                  >
                    {s}

                    {statusFilter === s && (
                      <Check className="size-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setDialog({ mode: "create" })}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Add Project
          </button>
        </div>

        <div className="px-4 pb-10 md:px-6">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">
                    Projects
                  </th>

                  {shown("Priority") && (
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                      Priority
                    </th>
                  )}

                  {shown("Lead") && (
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">
                      Lead
                    </th>
                  )}

                  {shown("Status") && (
                    <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                      Status
                    </th>
                  )}

                  {shown("Due Date") && (
                    <th className="hidden px-4 py-2.5 font-medium md:table-cell">
                      Due Date
                    </th>
                  )}

                  <th className="w-12 px-4 py-2.5 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <ProjectsSkeleton />
                ) : (

                  <>
                    {rows.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-0 hover:bg-surface"
                      >
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => router.push(`/projects/${p.id}/tasks`)}
                            className="text-left font-medium hover:underline"
                          >
                            {p.name}
                          </button>

                          {p.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {p.description}
                            </p>
                          )}
                        </td>

                        {shown("Priority") && (
                          <td className="hidden px-4 py-2.5 sm:table-cell">
                            <PriorityTag
                              priority={p.priority.replace(/_/g, " ")}
                            />
                          </td>
                        )}

                        {shown("Lead") && (
                          <td className="hidden px-4 py-2.5 sm:table-cell">
                            <MemberAvatar
                              member={p.lead}
                            />
                          </td>
                        )}

                        {shown("Status") && (
                          <td className="hidden px-4 py-2.5 md:table-cell">
                            <span className="inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                              {p.status.replace(/_/g, " ")}
                            </span>
                          </td>
                        )}

                        {shown("Due Date") && (
                          <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">
                            {p.due}
                          </td>
                        )}

                        <td className="px-4 py-2.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label={`Options for ${p.name}`}
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-40"
                            >
                              <DropdownMenuItem
                                onSelect={() =>
                                  setDialog({
                                    mode: "edit",
                                    project: p,
                                  })
                                }
                              >
                                <Pencil className="size-4" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onSelect={() =>
                                  handleDelete(p.id)
                                }
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}

                    {rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-sm text-muted-foreground"
                        >
                          No projects match your search or filters.
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td
                        colSpan={6}
                        className="px-2 py-1.5"
                      >
                        <button
                          onClick={() =>
                            setDialog({ mode: "create" })
                          }
                          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Plus className="size-4" />
                          Add Projects
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

    <ProjectDialog
  state={dialog}
  onOpenChange={(open) => {
    if (!open) {
      setDialog(null);
    }
  }}
  onSuccess={fetchProjects}
/>
    </div>
  );
}