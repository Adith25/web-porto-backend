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
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '12m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Beginning of time
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
        // Add the difference to the oldest data point to keep them in sync
        data[0].count += diff;
      }
    }

    return data;
  }

  private aggregateByDay(logs: any[], start: Date, end: Date) {
    const counts = new Map<string, number>();
    
    // Initialize all days in range with 0
    let current = new Date(start);
    while (current <= end) {
      counts.set(current.toISOString().split('T')[0], 0);
      current.setDate(current.getDate() + 1);
    }

    // Count logs
    logs.forEach(log => {
      const date = log.createdAt.toISOString().split('T')[0];
      if (counts.has(date)) {
        counts.set(date, (counts.get(date) || 0) + 1);
      }
    });

    return Array.from(counts.entries()).map(([date, count]) => ({ label: date, count }));
  }

  private aggregateByMonth(logs: any[], start: Date, end: Date) {
    const counts = new Map<string, number>();

    // Initialize months in range with 0
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1);
    
    while (current <= lastMonth) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      counts.set(key, 0);
      current.setMonth(current.getMonth() + 1);
    }

    // Count logs
    logs.forEach(log => {
      const key = `${log.createdAt.getFullYear()}-${String(log.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    });

    return Array.from(counts.entries()).map(([month, count]) => ({ label: month, count }));
  }
}
