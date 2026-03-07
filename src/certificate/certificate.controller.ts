import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
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
    // Membatasi tipe file hanya gambar atau PDF
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new BadRequestException('Only image or PDF files are allowed!'), false);
    }
    cb(null, true);
  },
};

@Controller('certificates')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Melindungi endpoint dengan JWT supaya hanya Admin yang bisa akses
  @UseInterceptors(FileInterceptor('file', multerOptions)) // Menerima payload file dengan field 'file'
  create(
    @Body() createCertificateDto: CreateCertificateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    // Path URL file yang diupload untuk disimpan di database
    const fileUrl = `/uploads/certificates/${file.filename}`;
    return this.certificateService.create(createCertificateDto, fileUrl);
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
  update(@Param('id') id: string, @Body() updateCertificateDto: UpdateCertificateDto) {
    return this.certificateService.update(+id, updateCertificateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.certificateService.remove(+id);
  }
}
