import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { MoveTaskDto } from '../dto/move-task.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { AssignTaskDto } from '../dto/assign-task.dto';
import { PaginationDto } from '../../common';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(projectId: string, dto: CreateTaskDto, user: any): Promise<import("../schemas/task.schema").Task>;
    findAll(projectId: string, filterDto: FilterTaskDto, dto: PaginationDto): Promise<import("../../common").PaginatedResult<any>>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateTaskDto, user: any): Promise<import("../schemas/task.schema").Task>;
    move(id: string, dto: MoveTaskDto, user: any): Promise<import("../schemas/task.schema").Task>;
    assign(id: string, dto: AssignTaskDto, user: any): Promise<import("../schemas/task.schema").Task>;
    unassign(id: string, userId: string, user: any): Promise<import("../schemas/task.schema").Task>;
    remove(id: string, user: any): Promise<void>;
}
