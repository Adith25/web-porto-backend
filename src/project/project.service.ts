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

  create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto });
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
    // Start a transaction to update all orders
    const updates = items.map((item) =>
      this.prisma.project.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }
}
