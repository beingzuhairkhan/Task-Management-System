import { Model, Types } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { UpdateProjectDto } from '../dto/update-project.dto';
export declare class ProjectRepository {
    private projectModel;
    constructor(projectModel: Model<Project>);
    create(data: Partial<Project>): Promise<Project>;
    findById(id: string | Types.ObjectId): Promise<Project | null>;
    findByIdLean(id: string | Types.ObjectId): Promise<any>;
    findAll(filter: any, sort: any, skip: number, limit: number): Promise<any[]>;
    count(filter?: Record<string, any>): Promise<number>;
    update(id: string, data: UpdateProjectDto): Promise<any | null>;
    addMember(id: string, userId: string, role: string): Promise<Project | null>;
    updateMemberRole(id: string, userId: string, role: string): Promise<Project | null>;
    removeMember(id: string, userId: string): Promise<Project | null>;
    delete(id: string): Promise<void>;
    findByMember(userId: string): Promise<Project[]>;
}
