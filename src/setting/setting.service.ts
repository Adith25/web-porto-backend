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
    try {
      const setting = await this.getSettings();
      return this.prisma.siteSetting.update({
        where: { id: setting.id },
        data: dto,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      // Fallback: try to create with id 1 if it doesn't exist
      if (error.code === 'P2025') {
        // Record not found, create it
        return this.prisma.siteSetting.create({
          data: {
            id: 1,
            announcementText: '⚠️ This website is still under development ⚠️',
            announcementActive: false,
            bannerColor: '#4f46e5',
            textColor: '#ffffff',
            animationSpeed: 25,
            ...dto,
          },
        });
      }
      throw error;
    }
  }

  async incrementVisitorCount() {
    const setting = await this.getSettings();
    const updateSetting = this.prisma.siteSetting.update({
      where: { id: setting.id },
      data: {
        visitorCount: {
          increment: 1,
        },
      },
    });
    const logVisitor = this.prisma.visitorLog.create({
      data: {},
    });
    
    const [result] = await Promise.all([updateSetting, logVisitor]);
    return result;
  }
}
