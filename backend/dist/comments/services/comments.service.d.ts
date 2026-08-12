import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { ActivityService } from '../../activity/services/activity.service';
export declare class CommentsService {
    private readonly commentRepository;
    private readonly activityService;
    constructor(commentRepository: CommentRepository, activityService: ActivityService);
    create(dto: CreateCommentDto, taskId: string, userId: string): Promise<import("../schemas/comment.schema").Comment>;
    findByTaskId(taskId: string): Promise<import("../schemas/comment.schema").Comment[]>;
    update(id: string, dto: UpdateCommentDto, userId: string): Promise<import("../schemas/comment.schema").Comment>;
    remove(id: string, userId: string): Promise<void>;
}
