import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InviteUserDto } from '../dto/invite-user.dto';
import {
  NotFoundException,
  PaginationDto,
  PaginatedResult,
  buildSearchFilter,
  buildSortOption,
  paginateResult,
} from '../../common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("mail.host"),
      port: Number(this.configService.get<string>("mail.port")),
      secure:
        this.configService.get<string>("mail.secure") === "true",

      auth: {
        user: this.configService.get<string>("mail.user"),
        pass: this.configService.get<string>("mail.password"),
      },

      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 60000,

      family: 4,
    } as any);
  }

  async findAll(dto: PaginationDto): Promise<PaginatedResult<any>> {
    const filter = buildSearchFilter(dto.search, ['username', 'email', 'jobTitle']);
    const sort = buildSortOption(dto.sort);
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userRepository.findAll(filter, sort, skip, limit),
      this.userRepository.count(filter),
    ]);
    return paginateResult(users, total, dto);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User', id);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.update(id, dto);
    if (!user) throw new NotFoundException('User', id);
    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User', id);
    await this.userRepository.delete(id);
  }

  async invite(dto: InviteUserDto) {
    const email = dto.email.trim()

    const existingUser =
      await this.userRepository.findByEmail(email);


    if (existingUser) {

      throw new ConflictException(
        'User with this email already exists',
      );
    }

    const frontendUrl = this.configService.get<string>('clientUrl');

    const inviteUrl = `${frontendUrl}`;


    try {
      const result = await this.transporter.sendMail({
        from: this.configService.get<string>("mail.from"),
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
    } catch (error) {
      this.logger.error(
        "Failed to send invitation email",
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException(
        "Failed to send invitation email",
      );
    }
    return {
      message: 'Invitation sent successfully',
      email,
    };
  }
}
