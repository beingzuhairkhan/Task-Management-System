import { Model } from 'mongoose';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { MoveTaskDto } from '../dto/move-task.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { ActivityService } from '../../activity/services/activity.service';
import { PaginationDto, PaginatedResult } from '../../common';
import { Task } from '../schemas/task.schema';
import { Project } from 'src/projects/schemas/project.schema';
export declare class TasksService {
    private readonly taskRepository;
    private readonly activityService;
    private projectModel;
    constructor(taskRepository: TaskRepository, activityService: ActivityService, projectModel: Model<Project>);
    create(dto: CreateTaskDto, projectId: string, userId: string): Promise<Task>;
    findAll(projectId: string, filterDto: FilterTaskDto, dto: PaginationDto, userId: string): Promise<PaginatedResult<any>>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task>;
    move(id: string, dto: MoveTaskDto, userId: string): Promise<Task>;
    assign(id: string, userId: string, assignerId: string): Promise<Task>;
    unassign(id: string, userId: string, unassignerId: string): Promise<Task>;
    remove(id: string, userId: string): Promise<void>;
}
