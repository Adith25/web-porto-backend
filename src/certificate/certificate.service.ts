import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertificateService {
  constructor(private prisma: PrismaService) {}

  // Menyimpan data sertifikat beserta URL file ke dalam DB
  async create(createCertificateDto: CreateCertificateDto, imageUrl: string, pdfUrl?: string | null) {
    const lastItem = await this.prisma.certificate.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = lastItem ? lastItem.order + 1 : 0;
    return this.prisma.certificate.create({
      data: {
        title: createCertificateDto.title,
        description: createCertificateDto.description,
        credentialUrl: createCertificateDto.credentialUrl,
        fileUrl: imageUrl,
        pdfUrl: pdfUrl || null,
        isPdf: !!pdfUrl,
        order,
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

  // Memperbarui sebagian field atau juga mengubah file. 
  async update(id: number, updateCertificateDto: UpdateCertificateDto, imageUrl?: string, pdfUrl?: string) {
    const existing = await this.findOne(id);
    
    const data: any = {
      title: updateCertificateDto.title,
      description: updateCertificateDto.description,
      credentialUrl: updateCertificateDto.credentialUrl,
    };

    if (imageUrl) {
      // Hapus file lama jika ada dan berbeda
      if (existing.fileUrl && existing.fileUrl !== imageUrl) {
        try {
          const oldPath = join(process.cwd(), existing.fileUrl);
          if (require('fs').existsSync(oldPath)) {
            require('fs').unlinkSync(oldPath);
          }
        } catch (e) {
          console.error('Failed to delete old image file:', e);
        }
      }
      data.fileUrl = imageUrl;
    }

    if (pdfUrl !== undefined) {
      // Hapus PDF lama jika ada dan berbeda
      if (existing.pdfUrl && existing.pdfUrl !== pdfUrl) {
        try {
          const oldPath = join(process.cwd(), existing.pdfUrl);
          if (require('fs').existsSync(oldPath)) {
            require('fs').unlinkSync(oldPath);
          }
        } catch (e) {
          console.error('Failed to delete old PDF file:', e);
        }
      }
      data.pdfUrl = pdfUrl;
      data.isPdf = !!pdfUrl;
    }

    return this.prisma.certificate.update({
      where: { id },
      data,
    });
  }

  // Menghapus data sertifikat dan filenya dari storage
  async remove(id: number) {
    const certificate = await this.findOne(id);
    
    // Hapus file image
    if (certificate.fileUrl) {
      const filePath = path.join(process.cwd(), certificate.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Hapus file PDF jika ada
    if (certificate.pdfUrl) {
      const pdfPath = path.join(process.cwd(), certificate.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    return this.prisma.certificate.delete({ where: { id } });
  }
}
