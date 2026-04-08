import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

const storage = process.env.VERCEL
  ? memoryStorage()
  : diskStorage({
      destination: './uploads/projects',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });

const multerOptions = {
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new BadRequestException('Image must be JPG, JPEG, WEBP, or PNG!'), false);
    }
    cb(null, true);
  },
};

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get('count')
  count() {
    return this.projectService.count();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('imageFile', multerOptions))
  create(
    @Body() dto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/projects/${file.filename}`;
    }
    return this.projectService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageFile', multerOptions))
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.imageUrl = `/uploads/projects/${file.filename}`;
    }
    return this.projectService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reorder')
  reorder(@Body() items: { id: number; order: number }[]) {
    return this.projectService.reorder(items);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }
}
