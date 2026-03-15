import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CvService {
  constructor(private prisma: PrismaService) {}

  // Upload CV baru (hanya 1 CV yang disimpan, upload baru akan menghapus yang lama)
  async upload(file: Express.Multer.File, fileUrl: string) {
    try {
      // Hapus CV yang lama jika ada
      const existingCv = await this.prisma.cV.findFirst();
      if (existingCv) {
        // Hapus file fisik
        if (existingCv.fileUrl) {
          const filePath = path.join(process.cwd(), existingCv.fileUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        // Hapus dari database
        await this.prisma.cV.delete({ where: { id: existingCv.id } });
      }

      // Simpan CV baru di table CV
      const newCv = await this.prisma.cV.create({
        data: {
          fileName: file.originalname,
          fileUrl: fileUrl,
          fileSize: file.size,
          mimeType: file.mimetype,
        },
      });

      // Update SiteSetting.cvUrl untuk kompatibilitas dengan sistem yang ada
      await this.prisma.siteSetting.update({
        where: { id: 1 },
        data: { cvUrl: fileUrl },
      }).catch((err) => {
        console.warn('Failed to update SiteSetting:', err);
        // Jika gagal, ignore (SiteSetting mungkin belum ada)
      });

      return newCv;
    } catch (error) {
      console.error('CV upload error:', error);
      throw new Error(`CV upload failed: ${error.message}`);
    }
  }

  // Mengambil CV yang tersimpan
  async findCv() {
    const cv = await this.prisma.cV.findFirst();
    if (!cv) throw new NotFoundException('CV not found');
    return cv;
  }

  // Menghapus CV
  async remove() {
    const cv = await this.findCv();
    
    // Hapus file fisik
    if (cv.fileUrl) {
      const filePath = path.join(process.cwd(), cv.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Hapus dari database
    const deleted = await this.prisma.cV.delete({ where: { id: cv.id } });

    // Clear cvUrl dari SiteSetting
    await this.prisma.siteSetting.update({
      where: { id: 1 },
      data: { cvUrl: null },
    }).catch(() => {
      // Jika gagal, ignore
    });

    return deleted;
  }
}
