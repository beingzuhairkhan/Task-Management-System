import { LabelRepository } from '../repositories/label.repository';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';
export declare class LabelsService {
    private readonly labelRepository;
    constructor(labelRepository: LabelRepository);
    create(dto: CreateLabelDto): Promise<import("../schemas/label.schema").Label>;
    findAll(): Promise<import("../schemas/label.schema").Label[]>;
    update(id: string, dto: UpdateLabelDto): Promise<import("../schemas/label.schema").Label>;
    remove(id: string): Promise<void>;
}
