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
import {
  TaskPriority,
} from "@/lib/tasks-data";

import {
  ProjectStatus,
  projectStatuses,
  type Project,
} from "@/lib/projects-store";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { Calendar } from "@/components/ui/calendar";

import { projectAPI, userAPI , subTaskAPI  } from "@/services/api";
import { toast } from "sonner";
export type ProjectDialogState =
  | { mode: "create" }
  | { mode: "edit"; project: Project };

export function ProjectDialog({
  state,
  onOpenChange,
  onSuccess,
  createSubTask = false,
  taskId,
}: {
  state: ProjectDialogState | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  createSubTask?: boolean;
  taskId?: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState<TaskPriority>(
    TaskPriority.MEDIUM,
  );

  const [status, setStatus] = useState<ProjectStatus>(
    ProjectStatus.PLANNING,
  );

  const [members, setMembers] = useState<any[]>([]);

  const [lead, setLead] = useState<string>("");

  const [due, setDue] = useState("");

  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] =
  useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await userAPI.findAllUsers();

        setMembers(response.data?.data ?? []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setMembers([]);
      }
    };

    loadMembers();
  }, []);

  useEffect(() => {
    if (!state) return;

    if (state.mode === "edit") {
      const p: any = state.project;

      setName(p.name ?? p.title ?? "");
      setDescription(p.description ?? "");

      setPriority(
        p.priority ?? TaskPriority.MEDIUM,
      );

      setStatus(
        p.status ?? ProjectStatus.PLANNING,
      );

      // Lead must be the user ID.
      setLead(
        p.lead?._id ??
        p.lead?.id ??
        p.lead?.userId ??
        "",
      );

      setDue(
        p.dueDate ??
        p.due ??
        "",
      );
    } else {
      setName("");
      setDescription("");

      setPriority(TaskPriority.MEDIUM);
      setStatus(ProjectStatus.PLANNING);

      setLead("");
      setDue("");
    }
  }, [state]);


  useEffect(() => {
    if (
      state?.mode === "create" &&
      !lead &&
      members.length > 0
    ) {
      setLead(
        members[0]._id ??
        members[0].id ??
        "",
      );
    }
  }, [members, state, lead]);


  const submit = async () => {
  if (!name.trim()) return;

  try {
    setLoading(true);

    if (createSubTask) {
      if (!taskId) {
        toast.error("Task ID is missing");
        return;
      }

      const payload = {
      title: name.trim(),
      description: description.trim(),
      status: status
        .toUpperCase()
        .replace(/\s+/g, "_"),
      priority: priority
        .toUpperCase()
        .replace(/\s+/g, "_"),
      subMembers: lead,
      dueDate: new Date(due).toISOString(),
    };

      await subTaskAPI.createSubTask(taskId, payload);

      toast.success("Subtask created successfully");

      onOpenChange(false);
      return;
    }

    if (!lead || !due) return;

    const payload  = {
      title: name.trim(),
      description: description.trim(),
      status: status
        .toUpperCase()
        .replace(/\s+/g, "_"),
      priority: priority
        .toUpperCase()
        .replace(/\s+/g, "_"),
      lead,
      dueDate: new Date(due).toISOString(),
    };

    if (state?.mode === "edit") {
      await projectAPI.updateProjectById(
        state.project.id,
        payload,
      );
      
      toast.success("Project updated successfully");
      onSuccess?.();
    } else {
      await projectAPI.createProject(payload);

      toast.success("Project created successfully");
      onSuccess?.();
    }

    onOpenChange(false);
  } catch (error: any) {
    console.error("Failed to save:", error);

    toast.error(
      error?.response?.data?.message ||
        "Failed to save",
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // Don't generate description while editing
  if (state?.mode !== "create") {
    return;
  }

  const title = name.trim();

  if (!title) {
    setDescription("");
    return;
  }

  const timer = setTimeout(async () => {
    try {
      setGeneratingDescription(true);

      const response =
        await projectAPI.generateDescription(title);

      setDescription(
        response.data?.description ?? ""
      );
    } catch (error) {
    } finally {
      setGeneratingDescription(false);
    }
  }, 800);

  return () => clearTimeout(timer);
}, [name, state?.mode]);

  const formattedDue = due
    ? new Date(due).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
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
              ? "Edit project"
              : "New project"}
          </DialogTitle>

          <DialogDescription>
            {state?.mode === "edit"
              ? "Update the details of this project."
              : "Add a project to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
  <div className="grid gap-1.5">
    <Label htmlFor="project-name">
      Name
    </Label>

    <Input
      id="project-name"
      value={name}
      onChange={(e) =>
        setName(e.target.value)
      }
      placeholder="Design homepage"
    />
  </div>

  <div className="grid gap-1.5">
    <div className="flex items-center justify-between">
      <Label htmlFor="project-desc">
        Description
      </Label>

      {generatingDescription && (
        <span className="text-xs text-muted-foreground">
          Generating...
        </span>
      )}
    </div>

    <Textarea
      id="project-desc"
      rows={3}
      value={description}
      onChange={(e) =>
        setDescription(e.target.value)
      }
      placeholder={
        generatingDescription
          ? "Generating description..."
          : "What is this project about?"
      }
    />
  </div>


          <div className="grid grid-cols-2 gap-3">
            {/* Priority */}
            <div className="grid gap-1.5">
              <Label>Priority</Label>

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
                  {Object.values(TaskPriority).map(
                    (value) => (
                      <SelectItem
                        key={value}
                        value={value}
                      >
                        {value
                          .replace("_", " ")
                          .toLowerCase()
                          .replace(
                            /\b\w/g,
                            (char) =>
                              char.toUpperCase(),
                          )}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="grid gap-1.5">
              <Label>Status</Label>

              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(
                    value as ProjectStatus,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {Object.values(
                    ProjectStatus,
                  ).map((value) => (
                    <SelectItem
                      key={value}
                      value={value}
                    >
                      {value
                        .replace("_", " ")
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

            {/* Lead */}
            <div className="grid gap-1.5">
              <Label>Lead</Label>

              <Select
                value={lead}
                onValueChange={setLead}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead" />
                </SelectTrigger>

                <SelectContent>
                  {members.map((member) => {
                    const memberId =
                      member._id ??
                      member.id;

                    return (
                      <SelectItem
                        key={memberId}
                        value={memberId}
                      >
                        {member.username ??
                          member.email}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
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
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={submit}
            disabled={
              loading ||
              !name.trim() ||
              !lead ||
              !due
            }
          >
            {loading
              ? "Saving..."
              : state?.mode === "edit"
                ? "Save changes"
                : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

