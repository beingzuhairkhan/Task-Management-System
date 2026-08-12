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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const group_repository_1 = require("../repositories/group.repository");
const common_2 = require("../../common");
let GroupsService = class GroupsService {
    constructor(groupRepository) {
        this.groupRepository = groupRepository;
    }
    async create(dto, projectId) {
        const groups = await this.groupRepository.findByProjectId(projectId);
        const order = dto.order ?? groups.length;
        const group = await this.groupRepository.create({
            name: dto.name,
            color: dto.color,
            order,
            projectId: new mongoose_1.Types.ObjectId(projectId),
        });
        return group;
    }
    async findByProjectId(projectId) {
        return this.groupRepository.findByProjectId(projectId);
    }
    async findById(id) {
        const group = await this.groupRepository.findById(id);
        if (!group)
            throw new common_2.NotFoundException('Group', id);
        return group;
    }
    async update(id, dto) {
        const group = await this.groupRepository.update(id, dto);
        if (!group)
            throw new common_2.NotFoundException('Group', id);
        return group;
    }
    async reorder(projectId, items) {
        await Promise.all(items.map((item) => this.groupRepository.updateOrder(item.groupId, item.order)));
        return this.groupRepository.findByProjectId(projectId);
    }
    async remove(id) {
        const group = await this.groupRepository.findById(id);
        if (!group)
            throw new common_2.NotFoundException('Group', id);
        await this.groupRepository.delete(id);
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [group_repository_1.GroupRepository])
], GroupsService);
//# sourceMappingURL=groups.service.js.map