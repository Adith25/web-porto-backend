import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  getSettings() {
    return this.settingService.getSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateSettings(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.updateSettings(updateSettingDto);
  }
}
