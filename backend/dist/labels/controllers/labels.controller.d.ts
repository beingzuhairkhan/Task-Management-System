import { LabelsService } from '../services/labels.service';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';
export declare class LabelsController {
    private readonly labelsService;
    constructor(labelsService: LabelsService);
    create(dto: CreateLabelDto): Promise<import("../schemas/label.schema").Label>;
    findAll(): Promise<import("../schemas/label.schema").Label[]>;
    update(id: string, dto: UpdateLabelDto): Promise<import("../schemas/label.schema").Label>;
    remove(id: string): Promise<void>;
}
