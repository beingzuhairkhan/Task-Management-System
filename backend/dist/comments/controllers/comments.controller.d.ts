import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(taskId: string, dto: CreateCommentDto, user: any): Promise<import("../schemas/comment.schema").Comment>;
    findAll(taskId: string): Promise<import("../schemas/comment.schema").Comment[]>;
    update(id: string, dto: UpdateCommentDto, user: any): Promise<import("../schemas/comment.schema").Comment>;
    remove(id: string, user: any): Promise<void>;
}
