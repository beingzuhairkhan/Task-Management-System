import { UserRole, UserProvider } from '../../common/enums';
export declare class UpdateUserDto {
    username?: string;
    fullName?: string;
    role?: UserRole;
    jobTitle?: string;
    provider?: UserProvider;
}
