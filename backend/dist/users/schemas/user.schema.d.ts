import { Document, Types } from 'mongoose';
import { UserRole, UserProvider } from '../../common/enums';
export declare class User extends Document {
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    googleId: string;
    provider: UserProvider;
    role: UserRole;
    jobTitle: string;
    isActive: boolean;
    lastLogin: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
