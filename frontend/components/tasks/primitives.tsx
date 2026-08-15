import { ChevronUp, ChevronsUp, Minus, ChevronDown, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Member } from "@/lib/tasks-data";
import  {  TaskPriority , TaskStatus } from "@/lib/tasks-data";

const toneClasses: Record<Member["tone"], string> = {
  violet: "bg-avatar-violet text-avatar-violet-foreground",
  amber: "bg-avatar-amber text-avatar-amber-foreground",
  teal: "bg-avatar-teal text-avatar-teal-foreground",
  slate: "bg-avatar-slate text-avatar-slate-foreground",
};


export function MemberAvatar({
  member,
  className,
}: {
  member: {
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    avatar?: string | null;
    initials?: string;
    tone?: Member["tone"];
  };
  className?: string;
}) {
  const displayName =
    member.username ??
    member.name ??
    member.email ??
    "User";

  const initials =
    member.initials ??
    displayName
      .split(/[\s_]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();


  return (
    <span
      title={displayName}
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-semibold ring-2 ring-card",
        member.tone
          ? toneClasses[member.tone]
          : "bg-avatar-slate text-avatar-slate-foreground",
        className,
      )}
    >
      {member.avatar ? (
        <img
          src={member.avatar}
          alt={displayName}
          className="size-full object-cover"
        />
      ) : (
        initials
      )}
    </span>
  );
}

export function MemberStack({
  members,
}: {
  members: Array<{
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    avatar?: string | null;
    initials?: string;
    tone?: Member["tone"];
  }>;
}) {
  if (members.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        Unassigned
      </span>
    );
  }

  return (
    <div className="flex -space-x-1.5">
      {members.map((member) => (
        <MemberAvatar
          key={member.id}
          member={member}
        />
      ))}
    </div>
  );
}


const priorityMeta: Record<
  TaskPriority,
  {
    className: string;
    Icon: React.ElementType;
  }
> = {
  [TaskPriority.URGENT]: {
    className: "text-priority-urgent",
    Icon: ChevronsUp,
  },

  [TaskPriority.HIGH]: {
    className: "text-priority-high",
    Icon: ChevronUp,
  },

  [TaskPriority.MEDIUM]: {
    className: "text-priority-medium",
    Icon: Minus,
  },

  [TaskPriority.LOW]: {
    className: "text-priority-low",
    Icon: ChevronDown,
  },

  [TaskPriority.NO_PRIORITY]: {
    className: "text-muted-foreground",
    Icon: Circle,
  },
};

export function PriorityTag({
  priority,
}: {
  priority: TaskPriority;
}) {
  const { className, Icon } = priorityMeta[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        className,
      )}
    >
      <Icon
        className="size-3.5 shrink-0"
        strokeWidth={2.5}
      />

      {priority === TaskPriority.NO_PRIORITY
        ? "No Priority"
        : priority}
    </span>
  );
}

export function LabelChip({
  children,
  status,
}: {
  children: React.ReactNode;
  status?: TaskStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium",

        status === TaskStatus.PLANNED &&
          "border-blue-500/30 bg-blue-500/10 text-blue-600",

        status === TaskStatus.BACKLOG &&
          "border-slate-500/30 bg-slate-500/10 text-slate-600",

        status === TaskStatus.IN_PROGRESS &&
          "border-yellow-500/30 bg-yellow-500/10 text-yellow-600",

        status === TaskStatus.BLOCKED &&
          "border-red-500/30 bg-red-500/10 text-red-600",

        status === TaskStatus.DONE &&
          "border-green-500/30 bg-green-500/10 text-green-600",

        !status &&
          "border-border bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

const groupDot: Record<string, string> = {
  todo: "bg-group-todo",
  doing: "bg-group-doing",
  completed: "bg-group-completed",
  hold: "bg-group-hold",
};

type GroupTone = keyof typeof groupDot;

export function GroupDot({ tone }: { tone: GroupTone }) {
  return (
    <span
      className={cn(
        "size-2 rounded-full",
        groupDot[tone]
      )}
    />
  );
}