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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repositories/user.repository");
const common_2 = require("../../common");
const config_1 = require("@nestjs/config");
const brevo_1 = require("@getbrevo/brevo");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(UsersService_1.name);
        this.brevo = new brevo_1.BrevoClient({
            apiKey: this.configService.get('BREVO_KEY'),
        });
    }
    async findAll(dto) {
        const filter = (0, common_2.buildSearchFilter)(dto.search, ['username', 'email', 'jobTitle']);
        const sort = (0, common_2.buildSortOption)(dto.sort);
        const page = dto.page || 1;
        const limit = dto.limit || 20;
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.userRepository.findAll(filter, sort, skip, limit),
            this.userRepository.count(filter),
        ]);
        return (0, common_2.paginateResult)(users, total, dto);
    }
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_2.NotFoundException('User', id);
        return user;
    }
    async update(id, dto) {
        const user = await this.userRepository.update(id, dto);
        if (!user)
            throw new common_2.NotFoundException('User', id);
        return user;
    }
    async remove(id) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_2.NotFoundException('User', id);
        await this.userRepository.delete(id);
    }
    async invite(dto) {
        const email = dto.email.trim();
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const frontendUrl = this.configService.get('clientUrl');
        const inviteUrl = frontendUrl;
        try {
            const result = await this.brevo.transactionalEmails.sendTransacEmail({
                sender: {
                    name: 'Task Management Dexter',
                    email: this.configService.get('mail.user'),
                },
                to: [
                    {
                        email,
                    },
                ],
                subject: 'You have been invited to Task Management System',
                htmlContent: `
          <!DOCTYPE html>
          <html>
            <body
              style="
                font-family: Arial, sans-serif;
                background: #f5f5f5;
                padding: 40px;
              "
            >
              <div
                style="
                  max-width: 600px;
                  margin: auto;
                  background: white;
                  padding: 30px;
                  border-radius: 10px;
                "
              >
                <h2>You have been invited!</h2>

                <p>
                  You have received an invitation
                  to join our platform.
                </p>

                <p>
                  Click the button below to accept
                  the invitation.
                </p>

                <a
                  href="${inviteUrl}"
                  style="
                    display: inline-block;
                    padding: 12px 24px;
                    background: #2563eb;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                  "
                >
                  Accept Invitation
                </a>
              </div>
            </body>
          </html>
        `,
            });
            this.logger.log(`Invitation email sent: ${result.messageId}`);
            return {
                message: 'Invitation sent successfully',
                email,
            };
        }
        catch (error) {
            this.logger.error('Failed to send invitation email', error instanceof Error
                ? error.stack
                : String(error));
            throw new common_1.InternalServerErrorException('Failed to send invitation email');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map