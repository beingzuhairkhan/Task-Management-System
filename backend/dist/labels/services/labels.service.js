"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelsService = void 0;
const common_1 = require("@nestjs/common");
const label_repository_1 = require("../repositories/label.repository");
const common_2 = require("../../common");
let LabelsService = class LabelsService {
    constructor(labelRepository) {
        this.labelRepository = labelRepository;
    }
    async create(dto) {
        return this.labelRepository.create(dto);
    }
    async findAll() {
        return this.labelRepository.findAll();
    }
    async update(id, dto) {
        const label = await this.labelRepository.update(id, dto);
        if (!label) {
            throw new common_2.NotFoundException('Label', id);
        }
        return label;
    }
    async remove(id) {
        const label = await this.labelRepository.findById(id);
        if (!label) {
            throw new common_2.NotFoundException('Label', id);
        }
        await this.labelRepository.delete(id);
    }
};
exports.LabelsService = LabelsService;
exports.LabelsService = LabelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [label_repository_1.LabelRepository])
], LabelsService);
//# sourceMappingURL=labels.service.js.map