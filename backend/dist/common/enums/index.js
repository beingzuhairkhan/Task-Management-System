"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = exports.ActivityAction = exports.TaskPriority = exports.TaskStatus = exports.ProjectPriority = exports.ProjectStatus = exports.ProjectRole = exports.UserProvider = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
    UserRole["OWNER"] = "OWNER";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserProvider;
(function (UserProvider) {
    UserProvider["GOOGLE"] = "GOOGLE";
    UserProvider["LOCAL"] = "LOCAL";
})(UserProvider || (exports.UserProvider = UserProvider = {}));
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["OWNER"] = "OWNER";
    ProjectRole["MANAGER"] = "MANAGER";
    ProjectRole["MEMBER"] = "MEMBER";
    ProjectRole["VIEWER"] = "VIEWER";
})(ProjectRole || (exports.ProjectRole = ProjectRole = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PLANNING"] = "PLANNING";
    ProjectStatus["ACTIVE"] = "ACTIVE";
    ProjectStatus["ON_HOLD"] = "ON_HOLD";
    ProjectStatus["COMPLETED"] = "COMPLETED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["LOW"] = "LOW";
    ProjectPriority["MEDIUM"] = "MEDIUM";
    ProjectPriority["HIGH"] = "HIGH";
    ProjectPriority["URGENT"] = "URGENT";
    ProjectPriority["NO_PRIORITY"] = "NO_PRIORITY";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PLANNED"] = "PLANNED";
    TaskStatus["BACKLOG"] = "BACKLOG";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["BLOCKED"] = "BLOCKED";
    TaskStatus["DONE"] = "DONE";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "LOW";
    TaskPriority["MEDIUM"] = "MEDIUM";
    TaskPriority["HIGH"] = "HIGH";
    TaskPriority["URGENT"] = "URGENT";
    TaskPriority["NO_PRIORITY"] = "NO_PRIORITY";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var ActivityAction;
(function (ActivityAction) {
    ActivityAction["CREATED"] = "CREATED";
    ActivityAction["UPDATED"] = "UPDATED";
    ActivityAction["DELETED"] = "DELETED";
    ActivityAction["ASSIGNED"] = "ASSIGNED";
    ActivityAction["UNASSIGNED"] = "UNASSIGNED";
    ActivityAction["STATUS_CHANGED"] = "STATUS_CHANGED";
    ActivityAction["PRIORITY_CHANGED"] = "PRIORITY_CHANGED";
    ActivityAction["MOVED"] = "MOVED";
    ActivityAction["COMMENTED"] = "COMMENTED";
    ActivityAction["COMMENT_DELETED"] = "COMMENT_DELETED";
    ActivityAction["DUE_DATE_CHANGED"] = "DUE_DATE_CHANGED";
})(ActivityAction || (exports.ActivityAction = ActivityAction = {}));
var Group;
(function (Group) {
    Group["TODO"] = "TODO";
    Group["DOING"] = "DOING";
    Group["COMPLETED"] = "COMPLETED";
    Group["ON_HOLD"] = "ON_HOLD";
})(Group || (exports.Group = Group = {}));
//# sourceMappingURL=index.js.map