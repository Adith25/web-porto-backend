import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { AboutCardService } from './about-card.service';
import { CreateAboutCardDto } from './dto/create-about-card.dto';
import { UpdateAboutCardDto } from './dto/update-about-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('about-cards')
export class AboutCardController {
  constructor(private readonly aboutCardService: AboutCardService) {}

  @Get()
  findAll() {
    return this.aboutCardService.findAll();
  }

  @Get('count')
  count() {
    return this.aboutCardService.count();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAboutCardDto) {
    return this.aboutCardService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAboutCardDto) {
    return this.aboutCardService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reorder')
  reorder(@Body() items: { id: number; order: number }[]) {
    return this.aboutCardService.reorder(items);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aboutCardService.remove(id);
  }
}
