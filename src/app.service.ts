import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a basic greeting string as a health indicator for the API
   */
  getHello(): string {
    return 'Web Portfolio API is running!';
  }
}
