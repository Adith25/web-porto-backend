import { PrismaClient } from '@prisma/client';

async function checkSync() {
  const prisma = new PrismaClient();
  const setting = await prisma.siteSetting.findFirst();
  const logsCount = await prisma.visitorLog.count();
  
  console.log('SiteSetting VisitorCount:', setting?.visitorCount);
  console.log('Total VisitorLogs:', logsCount);
  
  await prisma.$disconnect();
}

checkSync();
