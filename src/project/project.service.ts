import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({ orderBy: { order: 'asc' } });
  }

  async create(dto: CreateProjectDto) {
    const lastItem = await this.prisma.project.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = lastItem ? lastItem.order + 1 : 0;
    return this.prisma.project.create({ data: { ...dto, order } });
  }

  update(id: number, dto: UpdateProjectDto) {
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }

  count() {
    return this.prisma.project.count();
  }

  async reorder(items: { id: number; order: number }[]) {
    for (const item of items) {
      await this.prisma.project.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }
    return { success: true };
  }
}
