import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, BadRequestException } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

// Konfigurasi Multer: Gunakan memoryStorage di Vercel untuk menghindari error read-only file system
const storage = process.env.VERCEL
  ? memoryStorage()
  : diskStorage({
      destination: './uploads/certificates',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });

const multerOptions = {
  storage,
  fileFilter: (req, file, cb) => {
    // Membatasi tipe file
    if (file.fieldname === 'imageFile') {
      // Image: jpg, jpeg, png
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Image must be JPG, JPEG, or PNG!'), false);
      }
    } else if (file.fieldname === 'pdfFile') {
      // PDF: only pdf
      if (!file.originalname.match(/\.pdf$/)) {
        return cb(new BadRequestException('Certificate must be PDF!'), false);
      }
    }
    cb(null, true);
  },
};

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imageFile', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
  ], multerOptions))
  create(
    @Body() createCertificateDto: CreateCertificateDto,
    @UploadedFiles() files: { imageFile?: Express.Multer.File[], pdfFile?: Express.Multer.File[] },
  ) {
    if (!files.imageFile || files.imageFile.length === 0) {
      throw new BadRequestException('Image file is required');
    }
    
    const imageFile = files.imageFile[0];
    const pdfFile = files.pdfFile?.[0];
    
    // Path URL untuk image (Gunakan originalname jika filename tidak ada/memoryStorage)
    const imageFilename = imageFile.filename || `${Date.now()}-${imageFile.originalname}`;
    const imageUrl = `/uploads/certificates/${imageFilename}`;

    // Path URL untuk PDF (jika ada)
    const pdfFilename = pdfFile ? (pdfFile.filename || `${Date.now()}-${pdfFile.originalname}`) : null;
    const pdfUrl = pdfFilename ? `/uploads/certificates/${pdfFilename}` : null;
    
    return this.certificateService.create(createCertificateDto, imageUrl, pdfUrl);
  }

  @Get()
  findAll() {
    return this.certificateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificateService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imageFile', maxCount: 1 },
    { name: 'pdfFile', maxCount: 1 }
  ], multerOptions))
  update(
    @Param('id') id: string, 
    @Body() updateCertificateDto: UpdateCertificateDto,
    @UploadedFiles() files: { imageFile?: Express.Multer.File[], pdfFile?: Express.Multer.File[] },
  ) {
    const imageFile = files.imageFile?.[0];
    const pdfFile = files.pdfFile?.[0];
    
    // Path URL untuk image (jika diupload baru)
    const imageFilename = imageFile ? (imageFile.filename || `${Date.now()}-${imageFile.originalname}`) : undefined;
    const imageUrl = imageFilename ? `/uploads/certificates/${imageFilename}` : undefined;

    // Path URL untuk PDF (jika diupload baru)
    const pdfFilename = pdfFile ? (pdfFile.filename || `${Date.now()}-${pdfFile.originalname}`) : undefined;
    const pdfUrl = pdfFilename ? `/uploads/certificates/${pdfFilename}` : undefined;

    return this.certificateService.update(+id, updateCertificateDto, imageUrl, pdfUrl);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard)
  reorder(@Body() items: { id: number; order: number }[]) {
    return this.certificateService.reorder(items);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.certificateService.remove(+id);
  }
}
