import { Module } from '@nestjs/common';
import { AboutCardController } from './about-card.controller';
import { AboutCardService } from './about-card.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AboutCardController],
  providers: [AboutCardService],
})
export class AboutCardModule {}
