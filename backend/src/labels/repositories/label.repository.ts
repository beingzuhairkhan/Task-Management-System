import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Label } from '../schemas/label.schema';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';

@Injectable()
export class LabelRepository {
  constructor(@InjectModel(Label.name) private labelModel: Model<Label>) {}

  async create(data: Partial<Label>): Promise<Label> {
  const name = data.name?.trim();

  if (!name) {
    throw new Error("Label name is required");
  }

  const existing = await this.labelModel.findOne({
    name: {
      $regex: `^${name}$`,
      $options: "i",
    },
  });

  if (existing) {
    return existing;
  }

  const created = new this.labelModel({
    ...data,
    name,
  });

  return created.save();
}

  async findAll():Promise<Label[]>{
    return this.labelModel.find().sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<Label | null> {
    return this.labelModel.findById(id).exec();
  }

  async findByProjectId(projectId: string): Promise<Label[]> {
    return this.labelModel
      .find({ projectId: new Types.ObjectId(projectId) })
      .sort({ name: 1 })
      .exec();
  }

  async update(id: string, data: UpdateLabelDto): Promise<Label | null> {
    return this.labelModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.labelModel.deleteOne({ _id: id }).exec();
  }
}
