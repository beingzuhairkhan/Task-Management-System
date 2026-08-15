export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  OWNER = 'OWNER'
}

export enum UserProvider {
  GOOGLE = 'GOOGLE',
  LOCAL = 'LOCAL',
}

export enum ProjectRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  NO_PRIORITY = 'NO_PRIORITY'
}

export enum TaskStatus {
   PLANNED = "PLANNED",
  BACKLOG = "BACKLOG",
  IN_PROGRESS = "IN_PROGRESS",
  BLOCKED = "BLOCKED",
  DONE = "DONE"

}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  NO_PRIORITY = 'NO_PRIORITY'
}


export enum ActivityAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  ASSIGNED = 'ASSIGNED',
  UNASSIGNED = 'UNASSIGNED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  PRIORITY_CHANGED = 'PRIORITY_CHANGED',
  MOVED = 'MOVED',
  COMMENTED = 'COMMENTED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  DUE_DATE_CHANGED = 'DUE_DATE_CHANGED'
}


export enum Group {
  TODO = 'TODO',
  DOING = 'DOING',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}