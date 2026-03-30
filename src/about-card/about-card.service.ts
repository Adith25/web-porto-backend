import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAboutCardDto } from './dto/create-about-card.dto';
import { UpdateAboutCardDto } from './dto/update-about-card.dto';

@Injectable()
export class AboutCardService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.aboutCard.findMany({ orderBy: { order: 'asc' } });
  }

  async create(dto: CreateAboutCardDto) {
    const lastItem = await this.prisma.aboutCard.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = lastItem ? lastItem.order + 1 : 0;
    return this.prisma.aboutCard.create({ data: { ...dto, order } });
  }

  update(id: number, dto: UpdateAboutCardDto) {
    return this.prisma.aboutCard.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.aboutCard.delete({ where: { id } });
  }

  count() {
    return this.prisma.aboutCard.count();
  }

  async reorder(items: { id: number; order: number }[]) {
    for (const item of items) {
      await this.prisma.aboutCard.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }
    return { success: true };
  }
}
