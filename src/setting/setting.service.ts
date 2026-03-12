import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let setting = await this.prisma.siteSetting.findFirst();
    if (!setting) {
      setting = await this.prisma.siteSetting.create({
        data: {
          id: 1,
          announcementText: '⚠️ This website is still under development ⚠️',
          announcementActive: false,
          bannerColor: '#4f46e5',
          textColor: '#ffffff',
          animationSpeed: 25,
        },
      });
    }
    return setting;
  }

  async updateSettings(dto: UpdateSettingDto) {
    const setting = await this.getSettings();
    return this.prisma.siteSetting.update({
      where: { id: setting.id },
      data: dto,
    });
  }
}
