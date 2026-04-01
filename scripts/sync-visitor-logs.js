const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sync() {
  try {
    const setting = await prisma.siteSetting.findFirst();
    if (!setting) {
      console.log('No SiteSetting found.');
      return;
    }

    const logsCount = await prisma.visitorLog.count();
    const diff = setting.visitorCount - logsCount;

    if (diff > 0) {
      console.log(`Syncing: Creating ${diff} missing visitor logs...`);
      // Create missing logs for today (baseline)
      for (let i = 0; i < diff; i++) {
        await prisma.visitorLog.create({
          data: {
            timestamp: new Date()
          }
        });
      }
      console.log('Sync complete.');
    } else {
      console.log('Already in sync or logs exceed count.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

sync();
