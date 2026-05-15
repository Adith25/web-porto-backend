import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Root endpoint for service health monitoring and basic connectivity verification.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
