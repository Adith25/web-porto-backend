import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getVisitorStats(range: string) {
    const now = new Date();
    let startDate: Date;

    // Determine the start date and aggregation level
    switch (range) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '6m':
        // Start from exactly 5 months ago
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case '12m':
        // Start from exactly 11 months ago, bringing us up to the current 12th month
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        break;
      case 'all':
      default:
        // Find the date of the first log
        const firstLog = await this.prisma.visitorLog.findFirst({
          orderBy: { createdAt: 'asc' }
        });
        startDate = firstLog ? firstLog.createdAt : new Date();
        // Snap to beginning of that month
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        break;
    }

    // Fetch logs from start date
    const [logs, setting, totalLogsCount] = await Promise.all([
      this.prisma.visitorLog.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'asc' }
      }),
      this.prisma.siteSetting.findFirst(),
      this.prisma.visitorLog.count()
    ]);

    let data: { label: string; count: number }[];

    // Group logs based on range
    if (range === '1m') {
      data = this.aggregateByDay(logs, startDate, now);
    } else {
      data = this.aggregateByMonth(logs, startDate, now);
    }

    // Sync with global visitorCount (handle legacy counts)
    if (setting && data.length > 0) {
      const diff = setting.visitorCount - totalLogsCount;
      if (diff > 0) {
        // Add the difference to the LATEST data point (current) to keep them in sync
        // while maintaining chronological sense (since they were already present)
        data[data.length - 1].count += diff;
      }
    }

    return data;
  }

  private aggregateByDay(logs: any[], start: Date, end: Date) {
    const counts = new Map<string, number>();
    
    // Initialize all days in range with 0 using Jakarta timezone
    let current = new Date(start);
    while (current <= end) {
      const key = current.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
      counts.set(key, 0);
      current.setDate(current.getDate() + 1);
    }

    // Count logs using Jakarta timezone
    logs.forEach(log => {
      const key = log.createdAt.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    });

    return Array.from(counts.entries()).map(([date, count]) => ({ label: date, count }));
  }

  private aggregateByMonth(logs: any[], start: Date, end: Date) {
    const counts = new Map<string, number>();

    // Initialize months in range with 0 using Jakarta timezone
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    
    while (current <= lastMonth) {
      const jakartaDateStr = current.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
      const parts = jakartaDateStr.split('-');
      const key = `${parts[0]}-${parts[1]}`; // YYYY-MM
      counts.set(key, 0);
      current.setMonth(current.getMonth() + 1);
    }

    // Count logs using Jakarta timezone
    logs.forEach(log => {
      const jakartaDateStr = log.createdAt.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
      const parts = jakartaDateStr.split('-');
      const key = `${parts[0]}-${parts[1]}`; // YYYY-MM
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    });

    return Array.from(counts.entries()).map(([month, count]) => ({ label: month, count }));
  }
}
