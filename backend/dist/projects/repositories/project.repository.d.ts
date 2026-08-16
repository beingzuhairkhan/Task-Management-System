import { Model, Types } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Subtask } from 'src/subtasks/schemas/subtask.schema';
import { Task } from 'src/tasks/schemas/task.schema';
export declare class ProjectRepository {
    private projectModel;
    private substaskModel;
    private taskModel;
    constructor(projectModel: Model<Project>, substaskModel: Model<Subtask>, taskModel: Model<Task>);
    create(data: Partial<Project>): Promise<Project>;
    findById(id: string | Types.ObjectId): Promise<Project | null>;
    findByIdLean(id: string | Types.ObjectId): Promise<any>;
    findAll(filter: any, sort: any, skip: number, limit: number): Promise<any[]>;
    count(filter?: Record<string, any>): Promise<number>;
    update(id: string, data: UpdateProjectDto): Promise<any | null>;
    delete(id: string): Promise<void>;
    findByMember(userId: string): Promise<Project[]>;
}
