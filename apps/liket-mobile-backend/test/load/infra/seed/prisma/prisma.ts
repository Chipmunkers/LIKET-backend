import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasourceUrl:
    'postgresql://liket_mobile_load_test_admin:1234@localhost:5600/liket?schema=public',
});
