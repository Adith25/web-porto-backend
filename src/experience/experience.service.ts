import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.experience.findMany({ orderBy: { order: 'asc' } });
  }

  create(dto: CreateExperienceDto) {
    return this.prisma.experience.create({ data: dto });
  }

  update(id: number, dto: UpdateExperienceDto) {
    return this.prisma.experience.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.experience.delete({ where: { id } });
  }

  count() {
    return this.prisma.experience.count();
  }

  async reorder(items: { id: number; order: number }[]) {
    for (const item of items) {
      await this.prisma.experience.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }
    return { success: true };
  }
}
