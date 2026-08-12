import { SubtasksService } from '../services/subtasks.service';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
export declare class SubtasksController {
    private readonly subtasksService;
    constructor(subtasksService: SubtasksService);
    create(taskId: string, dto: CreateSubtaskDto, user: any): Promise<import("../schemas/subtask.schema").Subtask>;
    findAll(taskId: string): Promise<import("../schemas/subtask.schema").Subtask[]>;
    update(id: string, dto: UpdateSubtaskDto, user: any): Promise<import("../schemas/subtask.schema").Subtask>;
    remove(id: string, user: any): Promise<void>;
}
