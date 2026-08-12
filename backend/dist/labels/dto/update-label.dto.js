"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLabelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_label_dto_1 = require("./create-label.dto");
class UpdateLabelDto extends (0, swagger_1.PartialType)(create_label_dto_1.CreateLabelDto) {
}
exports.UpdateLabelDto = UpdateLabelDto;
//# sourceMappingURL=update-label.dto.js.map