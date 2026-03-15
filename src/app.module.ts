import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CertificateModule } from './certificate/certificate.module';
import { ProjectModule } from './project/project.module';
import { ExperienceModule } from './experience/experience.module';
import { SkillModule } from './skill/skill.module';
import { AboutCardModule } from './about-card/about-card.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync } from 'fs';
import { SettingModule } from './setting/setting.module';
import { CvModule } from './cv/cv.module';

// Determine static file serving path for both local and serverless environments
const getUploadsPath = () => {
  const uploadsPath = join(process.cwd(), 'uploads');
  return existsSync(uploadsPath) ? uploadsPath : null;
};

const uploadsPath = getUploadsPath();

@Module({
  imports: [
    UserModule,
    AuthModule,
    CertificateModule,
    ProjectModule,
    ExperienceModule,
    SkillModule,
    AboutCardModule,
    PrismaModule,
    ...(uploadsPath ? [ServeStaticModule.forRoot({
      rootPath: uploadsPath,
      serveRoot: '/uploads',
    })] : []),
    SettingModule,
    CvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
