import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';
export declare function buildSearchFilter(search: string | undefined, fields: string[]): Record<string, any>;
export declare function buildSortOption(sort: string | undefined): Record<string, 1 | -1>;
export declare function paginateResult<T>(data: T[], total: number, dto: PaginationDto): PaginatedResult<T>;
