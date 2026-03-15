import { Controller, Get, Patch, Body, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

// Multer configuration for CV upload: Use memoryStorage on Vercel
const cvStorage = process.env.VERCEL
  ? memoryStorage()
  : diskStorage({
      destination: './uploads/cv',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `cv-${uniqueSuffix}${ext}`);
      },
    });

const cvMulterOptions = {
  storage: cvStorage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(new BadRequestException('Only PDF or Word documents are allowed!'), false);
    }
    cb(null, true);
  },
};

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  getSettings() {
    return this.settingService.getSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateSettings(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.updateSettings(updateSettingDto);
  }

  @Post('cv')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', cvMulterOptions))
  async uploadCv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    try {
      const filename = file.filename || `${Date.now()}-${file.originalname}`;
      const fileUrl = `/uploads/cv/${filename}`;
      const result = await this.settingService.updateSettings({ cvUrl: fileUrl });
      return {
        success: true,
        message: 'CV uploaded successfully',
        cvUrl: fileUrl,
        data: result,
      };
    } catch (error) {
      console.error('CV upload error:', error);
      throw new BadRequestException(`CV upload failed: ${error.message}`);
    }
  }
}
