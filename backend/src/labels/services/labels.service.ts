import { Injectable } from '@nestjs/common';

import { LabelRepository } from '../repositories/label.repository';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';
import { NotFoundException } from '../../common';

@Injectable()
export class LabelsService {
  constructor(
    private readonly labelRepository: LabelRepository,
  ) {}

  async create(dto: CreateLabelDto) {
    try{
    return this.labelRepository.create(dto);
    }catch(err){
      throw err ;
    }
  }

  async findAll() {
    return this.labelRepository.findAll();
  }

  async update(id: string, dto: UpdateLabelDto) {
    const label = await this.labelRepository.update(id, dto);

    if (!label) {
      throw new NotFoundException('Label', id);
    }

    return label;
  }

  async remove(id: string): Promise<void> {
    const label = await this.labelRepository.findById(id);

    if (!label) {
      throw new NotFoundException('Label', id);
    }

    await this.labelRepository.delete(id);
  }
}