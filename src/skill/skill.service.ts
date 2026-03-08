import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.skill.findMany({ orderBy: { createdAt: 'asc' } });
  }

  create(dto: CreateSkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  update(id: number, dto: UpdateSkillDto) {
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.skill.delete({ where: { id } });
  }

  count() {
    return this.prisma.skill.count();
  }
}
