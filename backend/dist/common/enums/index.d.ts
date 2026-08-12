export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    OWNER = "OWNER"
}
export declare enum UserProvider {
    GOOGLE = "GOOGLE",
    LOCAL = "LOCAL"
}
export declare enum ProjectRole {
    OWNER = "OWNER",
    MANAGER = "MANAGER",
    MEMBER = "MEMBER",
    VIEWER = "VIEWER"
}
export declare enum ProjectStatus {
    PLANNING = "PLANNING",
    ACTIVE = "ACTIVE",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED"
}
export declare enum ProjectPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
    NO_PRIORITY = "NO_PRIORITY"
}
export declare enum TaskStatus {
    PLANNED = "PLANNED",
    BACKLOG = "BACKLOG",
    IN_PROGRESS = "IN_PROGRESS",
    BLOCKED = "BLOCKED",
    DONE = "DONE"
}
export declare enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
    NO_PRIORITY = "NO_PRIORITY"
}
export declare enum ActivityAction {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    DELETED = "DELETED",
    ASSIGNED = "ASSIGNED",
    UNASSIGNED = "UNASSIGNED",
    STATUS_CHANGED = "STATUS_CHANGED",
    PRIORITY_CHANGED = "PRIORITY_CHANGED",
    MOVED = "MOVED",
    COMMENTED = "COMMENTED",
    COMMENT_DELETED = "COMMENT_DELETED"
}
export declare enum Group {
    TODO = "TODO",
    DOING = "DOING",
    COMPLETED = "COMPLETED",
    ON_HOLD = "ON_HOLD"
}
