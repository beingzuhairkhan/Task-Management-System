"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repositories/user.repository");
const common_2 = require("../../common");
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("@nestjs/config");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(UsersService_1.name);
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: Number(this.configService.get("mail.port")),
            secure: this.configService.get("mail.secure") === "true",
            auth: {
                user: this.configService.get("mail.user"),
                pass: this.configService.get("mail.password"),
            },
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
            family: 4,
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
        const inviteUrl = `${frontendUrl}`;
        try {
            const result = await this.transporter.sendMail({
                from: this.configService.get("mail.from"),
                to: email,
                subject: "You have been invited in Task Management System",
                html: `
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
            this.logger.log(`Email sent: ${result.messageId}`);
        }
        catch (error) {
            this.logger.error("Failed to send invitation email", error instanceof Error ? error.stack : String(error));
            throw new common_1.InternalServerErrorException("Failed to send invitation email");
        }
        return {
            message: 'Invitation sent successfully',
            email,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map