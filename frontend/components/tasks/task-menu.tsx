"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowRight,
  Eye,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  groups,
  type Task,
} from "@/lib/tasks-data";

import { useTasks } from "@/lib/tasks-store";
import { cn } from "@/lib/utils";
import { taskAPI } from "@/services/api";

type TaskMenuProps = {
  task: Task;
  onEdit: () => void;
  className?: string;
};

export function TaskMenu({
  task,
  onEdit,
  className,
}: TaskMenuProps) {
const { deleteTask, moveTask } = useTasks();
  const router = useRouter();

  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const handleOpenDetails = () => {
    router.push(`/task/${task.id}`);
  };

const handleMove = async (groupId: string) => {
 if (groupId === task.group) {
  return;
}

  try {
    await moveTask(task.id, groupId);

    toast.success("Task moved successfully");
  } catch (error) {
    console.error("Failed to move task:", error);

    toast.error("Failed to move task");
  }
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Options for ${task.title}`}
        className={cn(
          "rounded p-1 text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground",
          className,
        )}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* Open Details */}
        <DropdownMenuItem onSelect={handleOpenDetails}>
          <Eye className="mr-2 size-4" />
          Open details
        </DropdownMenuItem>

        {/* Edit */}
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Move */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowRight className="mr-2 size-4" />
            Move to
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            {groups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                disabled={group.id === task.group}
                onSelect={() => handleMove(group.id)}
              >
                {group.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Delete */}
        <DropdownMenuItem
          onSelect={() => deleteTask(task.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}