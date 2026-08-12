import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: Partial<User>): Promise<User> {
    const created = new this.userModel(data);
    return created.save();
  }

  async findById(id: string | Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByIds(ids: (string | Types.ObjectId)[]): Promise<User[]> {
    return this.userModel
      .find({ _id: { $in: ids } })
      .select('-__v')
      .exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findAll(
    filter: Record<string, any> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 },
    skip = 0,
    limit = 20,
  ): Promise<User[]> {
    return this.userModel
      .find(filter)
      .select('-__v')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: id }, { $set: { lastLogin: new Date() } })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }
}
