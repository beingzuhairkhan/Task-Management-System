import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  groups,
  priorities,
  TaskStatus,
   TaskPriority,
  type Task,
} from "@/lib/tasks-data";
import { useTasks } from "@/lib/tasks-store";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Calendar } from "../ui/calendar";
import { labelAPI, taskAPI, userAPI } from "@/services/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
export type TaskDialogState =
  | {
    mode: "create";
    groupId: string;
  }
  | {
    mode: "edit";
    task: Task;
  };

interface User {
  id?: string;
  _id?: string;
  username: string;
}

interface LabelOption {
  id: string;
  name: string;
}

export function TaskDialog({
  state,
  onOpenChange,
}: {
  state: TaskDialogState | null;
  onOpenChange: (open: boolean) => void;
}) {
  // const { updateTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [groupId, setGroupId] = useState("TODO");

  const [priority, setPriority] = useState<any>("MEDIUM");

  const [status, setStatus] = useState<TaskStatus>(
    TaskStatus.PLANNED,
  );

  const [due, setDue] = useState("");

  // Reporter = single user ID
  const [reporter, setReporter] = useState("");

  // Members = multiple user IDs
  const [members, setMembers] = useState<string[]>([]);

  // Labels = multiple label IDs
  const [labels, setLabels] = useState<string[]>([]);

  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [labelOptions, setLabelOptions] = useState<LabelOption[]>([]);

  const params = useParams();

  const projectId = params.projectId as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersResponse, labelsResponse] = await Promise.all([
          userAPI.findAllUsers(),
          labelAPI.getLabel(),
        ]);

        const users = usersResponse.data?.data ?? [];

        const labels =
          labelsResponse.data ??
          [];

        setAvailableMembers(users);
        setLabelOptions(labels);
      } catch (error) {
        console.error(
          "Failed to fetch users or labels:",
          error,
        );

        setAvailableMembers([]);
        setLabelOptions([]);
      }
    };

    loadData();
  }, []);


  useEffect(() => {
    if (!state) return;

    if (state.mode === "edit") {
      const task = state.task as any;

      setTitle(task.title ?? "");
      setDescription(task.description ?? "");

      setGroupId(
        task.group ??
        task.groupId ??
        "TODO",
      );

      setPriority(
        task.priority ?? "MEDIUM",
      );

      setStatus(
        task.status ?? TaskStatus.PLANNED,
      );

      setDue(
        task.dueDate ??
        task.due ??
        "",
      );

  
      setReporter(
        typeof task.reporter === "string"
          ? task.reporter
          : task.reporter?.id ??
          task.reporter?._id ??
          "",
      );

  
      setMembers(
        (task.members ?? []).map(
          (member: any) =>
            typeof member === "string"
              ? member
              : member.id ??
              member._id,
        ),
      );


      setLabels(
        (task.labels ?? []).map(
          (label: any) =>
            typeof label === "string"
              ? label
              : label.id ??
              label._id,
        ),
      );
    } else {
      setTitle("");
      setDescription("");

      setGroupId(
        state.groupId?.toUpperCase() ??
        "TODO",
      );

      setPriority("MEDIUM");
      setStatus(TaskStatus.PLANNED);

      setDue("");

      setReporter("");
      setMembers([]);
      setLabels([]);
    }
  }, [state]);

 
  const toggle = (
    list: string[],
    set: (value: string[]) => void,
    value: string,
  ) => {
    set(
      list.includes(value)
        ? list.filter(
          (item) => item !== value,
        )
        : [...list, value],
    );
  };


  const submit = async () => {
    if (!title.trim()) return;

    if (!reporter) {
      console.error(
        "Reporter is required",
      );
      return;
    }

    const payload = {
      title: title.trim(),

      description:
        description.trim() || undefined,

      group: groupId,

      status: status.toUpperCase().replace(/\s+/g, "_"),

      priority: priority.toUpperCase().replace(/\s+/g, "_"),

      reporter,

      members,

      labels,

      dueDate:
        due || undefined,
    };

    try {
      if (state?.mode === "edit") {
        // await updateTask(state.task.id, payload);
        toast.success("Task updated successfully");
      } else {
        await taskAPI.createTask(projectId, payload);
        toast.success("Task created successfully");
      }


      onOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to save task:",
        error,
      );
      toast.error("Failed to save task");
    }
  };

  const formattedDue = due
    ? new Date(due).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    )
    : "";

  return (
    <Dialog
      open={!!state}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {state?.mode === "edit"
              ? "Edit task"
              : "New task"}
          </DialogTitle>

          <DialogDescription>
            {state?.mode === "edit"
              ? "Update the details of this task."
              : "Add a task to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Title */}
          <div className="grid gap-1.5">
            <Label htmlFor="task-title">
              Title
            </Label>

            <Input
              id="task-title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Write API documentation"
            />
          </div>

          {/* Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="task-desc">
              Description
            </Label>

            <Textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
              placeholder="What needs to be done?"
            />
          </div>

          {/* Group + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Group</Label>

              <Select
                value={groupId}
                onValueChange={setGroupId}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem
                      key={group.id}
                      value={group.id}
                    >
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>
                Priority
              </Label>

              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(
                    value as TaskPriority,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {priorities.map(
                    (priority) => (
                      <SelectItem
                        key={priority}
                        value={priority}
                      >
                        {priority}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Status</Label>

              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(
                    value as TaskStatus,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(
                    TaskStatus,
                  ).map((value) => (
                    <SelectItem
                      key={value}
                      value={value}
                    >
                      {value
                        .replace(
                          /_/g,
                          " ",
                        )
                        .toLowerCase()
                        .replace(
                          /\b\w/g,
                          (char) =>
                            char.toUpperCase(),
                        )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="project-due">
                Due date
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {formattedDue ||
                      "Select due date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-auto p-0"
                >
                  <Calendar
                    mode="single"
                    selected={
                      due
                        ? new Date(due)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (!date) return;

                      setDue(
                        date.toISOString(),
                      );
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Reporter + Members */}
          <div className="grid grid-cols-2 gap-3">
            {/* Reporter */}
            <div className="grid gap-1.5">
              <Label>
                Select Reporter
              </Label>

              <Select
                value={reporter}
                onValueChange={
                  setReporter
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reporter" />
                </SelectTrigger>

                <SelectContent>
                  {availableMembers.map(
                    (member) => {
                      const memberId =
                        member.id ??
                        member._id;

                      return (
                        <SelectItem
                          key={memberId}
                          value={memberId!}
                        >
                          {member.username}
                        </SelectItem>
                      );
                    },
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Members */}
            <div className="grid gap-1.5">
              <Label>
                Select Member
              </Label>

              <Select
                value=""
                onValueChange={(
                  memberId,
                ) =>
                  toggle(
                    members,
                    setMembers,
                    memberId,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      members.length > 0
                        ? `${members.length} member${members.length >
                          1
                          ? "s"
                          : ""
                        } selected`
                        : "Select members"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {availableMembers.map(
                    (member) => {
                      const memberId =
                        member.id ??
                        member._id;

                      const selected =
                        members.includes(
                          memberId!,
                        );

                      return (
                        <SelectItem
                          key={memberId}
                          value={memberId!}
                        >
                          {selected
                            ? "✓ "
                            : ""}
                          {
                            member.username
                          }
                        </SelectItem>
                      );
                    },
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Labels */}
          <div className="grid gap-1.5">
            <Label>
              Labels
            </Label>

            <div className="flex flex-wrap gap-1.5">
              {labelOptions.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() =>
                    toggle(
                      labels,
                      setLabels,
                      label.name,
                    )
                  }
                  className={cn(
                    "rounded-md border border-border px-2 py-1 text-xs font-medium transition-colors",
                    labels.includes(label.name)
                      ? "border-primary bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={submit}
            disabled={
              !title.trim() ||
              !reporter
            }
          >
            {state?.mode === "edit"
              ? "Save changes"
              : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}