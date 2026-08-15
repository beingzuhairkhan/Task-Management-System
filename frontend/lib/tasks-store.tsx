"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "next/navigation";

import { taskAPI } from "@/services/api";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/lib/tasks-data";
import { toast } from "sonner";

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;

  // Filters
  search: string;
  priorityFilter: TaskPriority | "All";
  statusFilter: TaskStatus | "All";

  setSearch: (value: string) => void;
  setPriorityFilter: (
    value: TaskPriority | "All",
  ) => void;
  setStatusFilter: (
    value: TaskStatus | "All",
  ) => void;

  getTask: (id: string) => Task | undefined;

  tasksByGroup: (groupId: string) => Task[];

  fetchTasks: () => Promise<void>;

  createTask: (data: any) => Promise<void>;

  moveTask: (
    taskId: string,
    groupId: string,
  ) => Promise<void>;

  deleteTask: (taskId: string) => Promise<void>;
};

const TasksContext =
  createContext<TasksContextValue | null>(null);

export function TasksProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();

  const projectId = params.projectId as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const [search, setSearch] = useState("");

  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriority | "All">("All");

  const [statusFilter, setStatusFilter] =
    useState<TaskStatus | "All">("All");

  // --------------------------------------------------
  // Debounced search
  // --------------------------------------------------

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);

       const params: {
      search?: string;
      priority?: TaskPriority;
      status?: TaskStatus;
    } = {};

      // Search
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      // Priority
     if (priorityFilter !== "All") {
      params.priority = priorityFilter
        .toUpperCase()
        .replace(/\s+/g, "_") as TaskPriority;
    }

    // Status
    if (statusFilter !== "All") {
      params.status = statusFilter
        .toUpperCase()
        .replace(/\s+/g, "_") as TaskStatus;
    }
      


      const response =
        await taskAPI.getTaskByProjectId(
          projectId,
          params,
        );

      console.log("Tasks:", response.data);

      setTasks(response.data?.data ?? []);
    } catch (error) {
      console.error(
        "Failed to fetch tasks:",
        error,
      );

      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [
    projectId,
    debouncedSearch,
    priorityFilter,
    statusFilter,
  ]);

  // --------------------------------------------------
  // Fetch whenever project/filter changes
  // --------------------------------------------------

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --------------------------------------------------
  // Get single task
  // --------------------------------------------------

  const getTask = useCallback(
    (id: string) => {
      return tasks.find(
        (task) => task.id === id,
      );
    },
    [tasks],
  );

  // --------------------------------------------------
  // Get tasks by group
  // --------------------------------------------------

  const tasksByGroup = useCallback(
    (groupId: string) => {
      return tasks.filter(
        (task) => task.group === groupId,
      );
    },
    [tasks],
  );

  // --------------------------------------------------
  // Create task
  // --------------------------------------------------

  const createTask = useCallback(
    async (data: any) => {
      if (!projectId) {
        throw new Error(
          "Project ID is missing",
        );
      }

      await taskAPI.createTask(
        projectId,
        data,
      );

      await fetchTasks();
    },
    [projectId, fetchTasks],
  );

  // --------------------------------------------------
  // Delete task
  // --------------------------------------------------

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!projectId) {
        throw new Error(
          "Project ID is missing",
        );
      }

      try {
        await taskAPI.deleteTask(
          projectId,
          taskId,
        );

        setTasks((currentTasks) =>
          currentTasks.filter(
            (task) => task.id !== taskId,
          ),
        );

        toast.success(
          "Task deleted successfully",
        );
      } catch (error) {
        console.error(
          "Failed to delete task:",
          error,
        );

        toast.error(
          "Failed to delete task",
        );
      }
    },
    [projectId],
  );

  // --------------------------------------------------
  // Move task
  // --------------------------------------------------

  const moveTask = useCallback(
    async (
      taskId: string,
      groupId: string,
    ) => {
      if (!projectId) {
        throw new Error(
          "Project ID is missing",
        );
      }

      const currentTask = tasks.find(
        (task) => task.id === taskId,
      );

      if (!currentTask) {
        throw new Error(
          "Task not found",
        );
      }

      if (currentTask.group === groupId) {
        return;
      }

      try {
        await taskAPI.moveTask(
          projectId,
          taskId,
          {
            groupId,
          },
        );

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  groupId,
                }
              : task,
          ),
        );
      } catch (error) {
        console.error(
          "Failed to move task:",
          error,
        );

        throw error;
      }
    },
    [projectId, tasks],
  );

  // --------------------------------------------------
  // Context value
  // --------------------------------------------------

  const value = useMemo(
    () => ({
      tasks,
      loading,

      search,
      priorityFilter,
      statusFilter,

      setSearch,
      setPriorityFilter,
      setStatusFilter,

      fetchTasks,
      getTask,
      tasksByGroup,

      createTask,
      moveTask,
      deleteTask,
    }),
    [
      tasks,
      loading,

      search,
      priorityFilter,
      statusFilter,

      fetchTasks,
      getTask,
      tasksByGroup,

      createTask,
      moveTask,
      deleteTask,
    ],
  );

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(
    TasksContext,
  );

  if (!context) {
    throw new Error(
      "useTasks must be used within TasksProvider",
    );
  }

  return context;
}