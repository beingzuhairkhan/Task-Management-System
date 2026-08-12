import { Model } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { UpdateCommentDto } from '../dto/update-comment.dto';
export declare class CommentRepository {
    private commentModel;
    constructor(commentModel: Model<Comment>);
    create(data: Partial<Comment>): Promise<Comment>;
    findById(id: string): Promise<Comment | null>;
    findByTaskId(taskId: string): Promise<Comment[]>;
    update(id: string, data: UpdateCommentDto): Promise<Comment | null>;
    delete(id: string): Promise<void>;
}
