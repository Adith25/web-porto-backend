import { Controller, Get, Post, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { CvService } from './cv.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

// Konfigurasi Multer untuk menyimpan CV di folder uploads: Gunakan memoryStorage di Vercel
const storage = process.env.VERCEL
  ? memoryStorage()
  : diskStorage({
      destination: './uploads/cv',
      filename: (req, file, cb) => {
        // Menghasilkan nama file unik
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `cv-${uniqueSuffix}${ext}`);
      },
    });

const multerOptions = {
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Membatasi tipe file hanya PDF
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new BadRequestException('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  },
};

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    try {
      const filename = file.filename || `${Date.now()}-${file.originalname}`;
      const fileUrl = `/uploads/cv/${filename}`;
      const result = await this.cvService.upload(file, fileUrl);
      return {
        success: true,
        message: 'CV uploaded successfully',
        data: result,
      };
    } catch (error) {
      console.error('CV upload error:', error);
      throw new BadRequestException(`CV upload failed: ${error.message}`);
    }
  }

  @Get()
  findCv() {
    return this.cvService.findCv();
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  remove() {
    return this.cvService.remove();
  }
}
