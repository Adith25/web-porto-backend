import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

// IMPORT SEMUA MODULE
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ProjectModule } from './project/project.module'
import { ExperienceModule } from './experience/experience.module'
import { CertificateModule } from './certificate/certificate.module'
import { SkillModule } from './skill/skill.module'
import { CvModule } from './cv/cv.module'
import { AboutCardModule } from './about-card/about-card.module'
import { SettingModule } from './setting/setting.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { MessageModule } from './message/message.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // ⬇️ INI YANG PENTING
    AuthModule,
    UserModule,
    ProjectModule,
    ExperienceModule,
    CertificateModule,
    SkillModule,
    CvModule,
    AboutCardModule,
    SettingModule,
    MessageModule,
    AnalyticsModule,
  ],
})
export class AppModule {}