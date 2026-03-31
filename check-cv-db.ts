import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const setting = await prisma.siteSetting.findUnique({
    where: { id: 1 },
  });
  console.log('Current cvUrl in SiteSetting:', setting?.cvUrl);
  
  const cv = await prisma.cV.findFirst({
    orderBy: { createdAt: 'desc' },
  });
  console.log('Latest CV in CV table:', cv);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
