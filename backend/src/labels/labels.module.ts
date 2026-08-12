import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabelSchema } from './schemas/label.schema';
import { LabelRepository } from './repositories/label.repository';
import { LabelsService } from './services/labels.service';
import { LabelsController } from './controllers/labels.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Label', schema: LabelSchema }])],
  controllers: [LabelsController],
  providers: [LabelsService, LabelRepository],
  exports: [LabelsService, LabelRepository],
})
export class LabelsModule {}
