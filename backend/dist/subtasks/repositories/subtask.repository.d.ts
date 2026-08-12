import { Model } from 'mongoose';
import { Subtask } from '../schemas/subtask.schema';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { User } from 'src/users/schemas/user.schema';
import { Task } from 'src/tasks/schemas/task.schema';
export declare class SubtaskRepository {
    private readonly subtaskModel;
    private readonly userModel;
    private readonly taskModel;
    constructor(subtaskModel: Model<Subtask>, userModel: Model<User>, taskModel: Model<Task>);
    canAccessTask(taskId: string, userId: string): Promise<boolean>;
    allRoleAccess(subtaskId: string, userId: string): Promise<boolean>;
    create(data: Partial<Subtask>, taskId: string, userId: string): Promise<Subtask>;
    findById(id: string): Promise<Subtask | null>;
    findByTaskId(taskId: string): Promise<Subtask[]>;
    update(id: string, data: UpdateSubtaskDto, userId: string): Promise<Subtask | null>;
    delete(id: string, userId: string): Promise<void>;
}
