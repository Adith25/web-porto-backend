import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertificateService {
  constructor(private prisma: PrismaService) {}

  // Menyimpan data sertifikat beserta URL file ke dalam DB
  async create(createCertificateDto: CreateCertificateDto, fileUrl: string) {
    return this.prisma.certificate.create({
      data: {
        title: createCertificateDto.title,
        description: createCertificateDto.description,
        credentialUrl: createCertificateDto.credentialUrl,
        fileUrl: fileUrl,
        isPdf: createCertificateDto.isPdf === 'true', // Mengonversi string ke boolean
      },
    });
  }

  // Mengambil semua sertifikat diurutkan berdasarkan terbaru
  async findAll() {
    return this.prisma.certificate.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const certificate = await this.prisma.certificate.findUnique({ where: { id } });
    if (!certificate) throw new NotFoundException('Certificate not found');
    return certificate;
  }

  async reorder(items: { id: number; order: number }[]) {
    for (const item of items) {
      await this.prisma.certificate.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }
    return { success: true };
  }

  // Memperbarui sebagian field tanpa mengubah file. 
  async update(id: number, updateCertificateDto: UpdateCertificateDto) {
    return this.prisma.certificate.update({
      where: { id },
      data: {
        title: updateCertificateDto.title,
        description: updateCertificateDto.description,
        credentialUrl: updateCertificateDto.credentialUrl,
      },
    });
  }

  // Menghapus data sertifikat dan filenya dari storage
  async remove(id: number) {
    const certificate = await this.findOne(id);
    
    // Hapus file fisik jika ada
    if (certificate.fileUrl) {
      const filePath = path.join(process.cwd(), certificate.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return this.prisma.certificate.delete({ where: { id } });
  }
}
