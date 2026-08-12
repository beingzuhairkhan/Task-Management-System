export enum TaskPriority {
  MEDIUM = "Medium",
  LOW = "Low",
  HIGH = "High",
  URGENT = "Urgent",
  NO_PRIORITY = "No Priority",
}

export enum TaskStatus {
  PLANNED = "Planned",
  BACKLOG = "Backlog",
  IN_PROGRESS = "In Progress",
  BLOCKED = "Blocked",
  DONE = "Done"
}


export type Member = {
  name: string;
  initials: string;
  tone: "violet" | "amber" | "teal" | "slate";
};



export type Group = {
  id: string;
  name: string;
  tone: "todo" | "doing" | "completed" | "hold";
};



export const priorities: TaskPriority[] = [
  TaskPriority.MEDIUM,
  TaskPriority.NO_PRIORITY,
  TaskPriority.URGENT,
  TaskPriority.HIGH,
  TaskPriority.LOW,
];

export const statusOptions: TaskStatus[] = [
  TaskStatus.PLANNED,
  TaskStatus.BACKLOG,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.DONE
];


export const groups: Group[] = [
  {
    id: "TODO",
    name: "To Do",
    tone: "todo",
  },
  {
    id: "DOING",
    name: "Doing",
    tone: "doing",
  },
  {
    id: "COMPLETED",
    name: "Completed",
    tone: "completed",
  },
  {
    id: "ON_HOLD",
    name: "On Hold",
    tone: "hold",
  },
];

// const sub = (
//   id: string,
//   title: string,
//   priority: TaskPriority,
//   members: Member[],
//   due: string,
// ): Subtask => ({
//   id,
//   title,
//   priority,
//   members,
//   due,
//   done: false,
// });



export const fieldOptions = [
  "Priority",
  "Members",
  "Due Date",
  "Labels",
  "Status",
  "Reporter",
] as const;

export type User = {
    id: string;
    username: string;
    avatar?: string;
    email?: string;
    jobTitle?:string;
};

export type Subtask = {
    id: string;
    title: string;
    description?: string;
    status?: string;
    priority: TaskPriority;
    subMember?: User | null;
    dueDate?: string;
    order?: number;
};

export type Comment = {
    id: string;
    body: string;
    at: string;
    author: User;
};

export type Task = {
    id: string;
    _id?: string;

    projectId: string;
    ownerId?: string;

    group: string;

    title: string;
    description: string;

    status: string;
    priority: TaskPriority;

    reporter: User;
    members: User[];

    labels: string[];
    resources: string[];

    dueDate?: string;
    due?: string;
    dueShort?: string;

    order: number;

    estimatedHours?: number;
    spentHours?: number;

    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;

    subtasks: Subtask[];
    comments: Comment[];
};


export type SubtasksSectionProps = {
    subtasks: Subtask[];
    taskId: string;
    onDeleteSubtask: (subtaskId: string) => void;
};