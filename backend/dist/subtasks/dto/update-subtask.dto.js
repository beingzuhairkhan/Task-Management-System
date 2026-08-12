"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubtaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_subtask_dto_1 = require("./create-subtask.dto");
class UpdateSubtaskDto extends (0, swagger_1.PartialType)(create_subtask_dto_1.CreateSubtaskDto) {
}
exports.UpdateSubtaskDto = UpdateSubtaskDto;
//# sourceMappingURL=update-subtask.dto.js.map