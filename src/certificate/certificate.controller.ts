import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, BadRequestException } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Konfigurasi Multer untuk menyimpan file di folder uploads
const multerOptions = {
  storage: diskStorage({
    destination: './uploads/certificates',
    filename: (req, file, cb) => {
      // Menghasilkan nama file unik
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
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
    
    // Path URL untuk image
    const imageUrl = `/uploads/certificates/${imageFile.filename}`;
    // Path URL untuk PDF (jika ada)
    const pdfUrl = pdfFile ? `/uploads/certificates/${pdfFile.filename}` : null;
    
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
    const imageUrl = imageFile ? `/uploads/certificates/${imageFile.filename}` : undefined;
    // Path URL untuk PDF (jika diupload baru)
    const pdfUrl = pdfFile ? `/uploads/certificates/${pdfFile.filename}` : undefined;

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
