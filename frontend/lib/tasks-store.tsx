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
import type { Task } from "@/lib/tasks-data";

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;
  getTask: (id: string) => Task | undefined;
  tasksByGroup: (groupId: string) => Task[];
  fetchTasks: () => Promise<void>;
  createTask: (data: any) => Promise<void>;
  moveTask: (taskId: string, groupId: string) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();

  const projectId = params.projectId as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const response = await taskAPI.getTaskByProjectId(projectId);

      console.log("Tasks:", response.data);

      setTasks(response.data?.data ?? []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch tasks when project changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Get single task
  const getTask = useCallback(
    (id: string) => {
      return tasks.find((task) => task.id === id);
    },
    [tasks],
  );

  // Get tasks by group
  const tasksByGroup = useCallback(
    (groupId: string) => {
      return tasks.filter((task) => task.groupId === groupId);
    },
    [tasks],
  );

  // Create task
  const createTask = useCallback(
    async (data: any) => {
      if (!projectId) {
        throw new Error("Project ID is missing");
      }

      await taskAPI.createTask(projectId, data);

      await fetchTasks();
    },
    [projectId, fetchTasks],
  );

  // Move task
  const moveTask = useCallback(
    async (taskId: string, groupId: string) => {
      if (!projectId) {
        throw new Error("Project ID is missing");
      }

      // Find current task
      const currentTask = tasks.find(
        (task) => task.id === taskId,
      );

      if (!currentTask) {
        throw new Error("Task not found");
      }

      // Don't move if already in the same group
      if (currentTask.groupId === groupId) {
        return;
      }

      try {
   
        await taskAPI.moveTask(projectId, taskId, {
          groupId,
        });

        
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
        console.error("Failed to move task:", error);
        throw error;
      }
    },
    [projectId, tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      loading,
      fetchTasks,
      getTask,
      tasksByGroup,
      createTask,
      moveTask,
    }),
    [
      tasks,
      loading,
      fetchTasks,
      getTask,
      tasksByGroup,
      createTask,
      moveTask,
    ],
  );

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error(
      "useTasks must be used within TasksProvider",
    );
  }

  return context;
}