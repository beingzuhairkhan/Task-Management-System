import { SubtaskRepository } from '../repositories/subtask.repository';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { ActivityService } from '../../activity/services/activity.service';
export declare class SubtasksService {
    private readonly subtaskRepository;
    private readonly activityService;
    constructor(subtaskRepository: SubtaskRepository, activityService: ActivityService);
    create(dto: CreateSubtaskDto, taskId: string, userId: string): Promise<import("../schemas/subtask.schema").Subtask>;
    findByTaskId(taskId: string): Promise<import("../schemas/subtask.schema").Subtask[]>;
    findById(id: string): Promise<import("../schemas/subtask.schema").Subtask>;
    update(id: string, dto: UpdateSubtaskDto, userId: string): Promise<import("../schemas/subtask.schema").Subtask>;
    remove(id: string, userId: string): Promise<void>;
}
