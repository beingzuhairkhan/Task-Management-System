import { Document, Types } from 'mongoose';
import { ProjectPriority, ProjectStatus, ProjectRole } from '../../common/enums';
export declare class Project extends Document {
    title: string;
    description: string;
    owner: Types.ObjectId;
    members: {
        user: Types.ObjectId;
        role: ProjectRole;
    }[];
    priority: ProjectPriority;
    status: ProjectStatus;
    lead: Types.ObjectId;
    startDate: Date;
    dueDate: Date;
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project, any, {}> & Project & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Project> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
