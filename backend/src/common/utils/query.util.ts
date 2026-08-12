import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';

export function buildSearchFilter(
  search: string | undefined,
  fields: string[],
): Record<string, any> {
  if (!search || !fields.length) return {};
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    })),
  };
}

export function buildSortOption(sort: string | undefined): Record<string, 1 | -1> {
  if (!sort) return { createdAt: -1 };
  const descending = sort.startsWith('-');
  const field = descending ? sort.slice(1) : sort;
  return { [field]: descending ? -1 : 1 };
}

export function paginateResult<T>(
  data: T[],
  total: number,
  dto: PaginationDto,
): PaginatedResult<T> {
  const page = dto.page || 1;
  const limit = dto.limit || 20;
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
