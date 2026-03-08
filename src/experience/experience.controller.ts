import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @Get('count')
  count() {
    return this.experienceService.count();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateExperienceDto) {
    return this.experienceService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExperienceDto) {
    return this.experienceService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.experienceService.remove(id);
  }
}
