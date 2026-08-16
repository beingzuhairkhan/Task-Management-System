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
import { Resend } from 'resend';
@Injectable()
export class UsersService {
   private readonly resend: Resend;
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    this.resend = new Resend(
      this.configService.get<string>('RESEND_KEY'),
    );
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
    const email = dto.email.trim();

    const existingUser =
      await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists',
      );
    }

    const frontendUrl =
      this.configService.get<string>('clientUrl');

    const inviteUrl = `${frontendUrl}`;

    try {
      const { data, error } =
        await this.resend.emails.send({
          from:
            this.configService.get<string>('mail.user') ,

          to: [email],

          subject:
            'You have been invited to Task Management System',

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

      if (error) {
        this.logger.error(
          'Resend failed to send invitation email',
          error,
        );

        throw new InternalServerErrorException(
          'Failed to send invitation email',
        );
      }

      this.logger.log(
        `Invitation email sent: ${data?.id}`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to send invitation email',
        error instanceof Error
          ? error.stack
          : String(error),
      );

      if (
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to send invitation email',
      );
    }

    return {
      message: 'Invitation sent successfully',
      email,
    };
  }
}