import { Controller, Get, Patch, Body, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Multer configuration for CV upload
const cvMulterOptions = {
  storage: diskStorage({
    destination: './uploads/cv',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `cv-${uniqueSuffix}${ext}`);
    },
  }),
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
    const fileUrl = `/uploads/cv/${file.filename}`;
    return this.settingService.updateSettings({ cvUrl: fileUrl });
  }
}
