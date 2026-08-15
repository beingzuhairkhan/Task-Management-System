import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Activity as ActivityIcon,
} from "lucide-react";
import { useState } from "react";

type ActivityUser = {
  id: string;
  username?: string;
  email?: string;
  avatar?: string;
};

type Activity = {
  id: string;
  taskId: string;
  userId: ActivityUser;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
  updatedAt: string;
};

interface UpdatesProps {
  activities: Activity[];
}

export function Updates({ activities }: UpdatesProps) {
  const [open, setOpen] = useState(true);

  const formatValue = (value?: string) => {
    if (!value) return "";

    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatAction = (activity: Activity) => {
    const user = activity.userId?.username || "Someone";

    switch (activity.action) {
      case "STATUS_CHANGED":
        return (
          <>
            <span>{user}</span> changed status from{" "}
            <span className="font-medium text-foreground">
              {formatValue(activity.oldValue)}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {formatValue(activity.newValue)}
            </span>
          </>
        );

      case "PRIORITY_CHANGED":
        return (
          <>
            <span>{user}</span> changed priority from{" "}
            <span className="font-medium text-foreground">
              {formatValue(activity.oldValue)}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {formatValue(activity.newValue)}
            </span>
          </>
        );

      case "MOVED":
        return (
          <>
            <span>{user}</span> moved the task
          </>
        );

      case "CREATED":
        return (
          <>
            <span>{user}</span> created the task
          </>
        );

      case "UPDATED":
        return (
          <>
            <span>{user}</span> updated the task
            
          </>
        );

        case "COMMENT_DELETED":
  return (
    <>
      <span>{user}</span> deleted comment{" "}
      <span className="font-medium text-foreground">
        {activity.oldValue}
      </span>
    </>
  );

      default:
        return (
          <>
            <span>{user}</span>{" "}
            {formatValue(activity.action)}
             {" "}
            <span className="font-medium text-foreground">
              {formatValue(activity.newValue)}
            </span>
          </>
        );
    }
  };

  const formatDate = (date: string) => {
    const activityDate = new Date(date);
    const now = new Date();

    const diff = now.getTime() - activityDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return activityDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "PRIORITY_CHANGED":
        return (
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-50">
            <ActivityIcon className="size-3.5 text-red-500" />
          </div>
        );

      case "STATUS_CHANGED":
        return (
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <ActivityIcon className="size-3.5 text-blue-500" />
          </div>
        );

      case "CREATED":
        return (
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-50">
            <ActivityIcon className="size-3.5 text-green-500" />
          </div>
        );

      default:
        return (
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
            <ActivityIcon className="size-3.5 text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card  mt-2">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-1 px-3 py-2 text-left hover:bg-muted/40"
      >
        {open ? (
          <ChevronDown className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground" />
        )}

        <span className="text-sm font-medium text-foreground">
          Updates
        </span>
          <DropdownMenuSeparator />
      </button>

      {/* Activities */}
      {open && (
        <div className="px-3 pb-2">
          {activities.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              No updates yet
            </div>
          ) : (
            <div className="space-y-1">
              {activities.map((activity) => {
                const user = activity.userId;
                const username =
                  user?.username || user?.email || "You";

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-2 rounded-md px-1 py-1.5"
                  >
                    {/* Avatar */}
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={username}
                        className="size-6 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      getActivityIcon(activity.action)
                    )}

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs leading-4 text-muted-foreground">
                        {formatAction(activity)} 
                      </div>

                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}