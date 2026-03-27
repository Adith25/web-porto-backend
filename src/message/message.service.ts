import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: createMessageDto,
    });
  }

  async findAll() {
    return this.prisma.message.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.message.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: number) {
    return this.prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: number) {
    return this.prisma.message.delete({
      where: { id },
    });
  }
}
