import { CreateTaskDto } from './create-task.dto';
declare const UpdateTaskDto_base: import("@nestjs/common").Type<Partial<Omit<CreateTaskDto, "ownerId">>>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
}
export {};
