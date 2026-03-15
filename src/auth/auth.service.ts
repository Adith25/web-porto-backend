import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    console.log(`[LOGIN ATTEMPT] Email: '${email}', Password: '${password}'`);
    // Cari admin berdasarkan email
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    console.log(`[LOGIN ATTEMPT] Admin found:`, admin ? `Yes (ID: ${admin.id})` : 'No');
    
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log(`[LOGIN ATTEMPT] Bcrypt compare result: ${isPasswordValid}`);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Buat JWT payload
    const payload = { email: admin.email, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
