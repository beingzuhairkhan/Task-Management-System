import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UserRepository {
    private userModel;
    constructor(userModel: Model<User>);
    create(data: Partial<User>): Promise<User>;
    findById(id: string | Types.ObjectId): Promise<User | null>;
    findByIds(ids: (string | Types.ObjectId)[]): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    findAll(filter?: Record<string, any>, sort?: Record<string, 1 | -1>, skip?: number, limit?: number): Promise<User[]>;
    count(filter?: Record<string, any>): Promise<number>;
    update(id: string, data: UpdateUserDto): Promise<User | null>;
    updateLastLogin(id: string): Promise<void>;
    delete(id: string): Promise<void>;
}
