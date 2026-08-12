import { Model } from 'mongoose';
import { Label } from '../schemas/label.schema';
import { UpdateLabelDto } from '../dto/update-label.dto';
export declare class LabelRepository {
    private labelModel;
    constructor(labelModel: Model<Label>);
    create(data: Partial<Label>): Promise<Label>;
    findAll(): Promise<Label[]>;
    findById(id: string): Promise<Label | null>;
    findByProjectId(projectId: string): Promise<Label[]>;
    update(id: string, data: UpdateLabelDto): Promise<Label | null>;
    delete(id: string): Promise<void>;
}
