"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSearchFilter = buildSearchFilter;
exports.buildSortOption = buildSortOption;
exports.paginateResult = paginateResult;
function buildSearchFilter(search, fields) {
    if (!search || !fields.length)
        return {};
    return {
        $or: fields.map((field) => ({
            [field]: { $regex: search, $options: 'i' },
        })),
    };
}
function buildSortOption(sort) {
    if (!sort)
        return { createdAt: -1 };
    const descending = sort.startsWith('-');
    const field = descending ? sort.slice(1) : sort;
    return { [field]: descending ? -1 : 1 };
}
function paginateResult(data, total, dto) {
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
//# sourceMappingURL=query.util.js.map