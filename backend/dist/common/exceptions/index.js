"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = exports.ConflictException = exports.BadRequestException = exports.ForbiddenException = exports.NotFoundException = void 0;
const common_1 = require("@nestjs/common");
class NotFoundException extends common_1.HttpException {
    constructor(resource, id) {
        super({
            statusCode: common_1.HttpStatus.NOT_FOUND,
            error: 'NotFound',
            message: id ? `${resource} with id ${id} not found` : `${resource} not found`,
        }, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.NotFoundException = NotFoundException;
class ForbiddenException extends common_1.HttpException {
    constructor(message = 'You do not have permission to perform this action') {
        super({ statusCode: common_1.HttpStatus.FORBIDDEN, error: 'Forbidden', message }, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenException = ForbiddenException;
class BadRequestException extends common_1.HttpException {
    constructor(message) {
        super({ statusCode: common_1.HttpStatus.BAD_REQUEST, error: 'BadRequest', message }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.BadRequestException = BadRequestException;
class ConflictException extends common_1.HttpException {
    constructor(message) {
        super({ statusCode: common_1.HttpStatus.CONFLICT, error: 'Conflict', message }, common_1.HttpStatus.CONFLICT);
    }
}
exports.ConflictException = ConflictException;
class UnauthorizedException extends common_1.HttpException {
    constructor(message = 'Unauthorized') {
        super({ statusCode: common_1.HttpStatus.UNAUTHORIZED, error: 'Unauthorized', message }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
//# sourceMappingURL=index.js.map