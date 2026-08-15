import { Model, Types, FilterQuery } from 'mongoose';
import { Task } from '../schemas/task.schema';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { User } from 'src/users/schemas/user.schema';
import { Label } from 'src/labels/schemas/label.schema';
import { Subtask } from 'src/subtasks/schemas/subtask.schema';
export declare class TaskRepository {
    private taskModel;
    private userModel;
    private labelModel;
    private substaskModel;
    constructor(taskModel: Model<Task>, userModel: Model<User>, labelModel: Model<Label>, substaskModel: Model<Subtask>);
    create(data: Partial<Task>): Promise<Task>;
    findById(id: string): Promise<any | null>;
    findByIdLean(id: string): Promise<any>;
    findAll(filter: FilterQuery<Task>, sort?: Record<string, 1 | -1>, skip?: number, limit?: number): Promise<Task[]>;
    count(filter: FilterQuery<Task>): Promise<number>;
    update(id: string, data: UpdateTaskDto | Partial<Task>): Promise<Task | null>;
    move(id: string, group: string): Promise<Task | null>;
    addAssignee(id: string, userId: string): Promise<Task | null>;
    removeAssignee(id: string, userId: string): Promise<Task | null>;
    delete(id: string): Promise<void>;
    findManyByProject(projectId: string): Promise<Task[]>;
    buildFilter(projectId: string, filterDto: FilterTaskDto, search?: string, userId?: string, projectOwnerId?: Types.ObjectId, projectLeadId?: Types.ObjectId, subTaskTaskIds?: Types.ObjectId[]): FilterQuery<Task>;
}
