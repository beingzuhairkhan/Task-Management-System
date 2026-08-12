"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function Auth() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)());
}
//# sourceMappingURL=auth.decorator.js.map