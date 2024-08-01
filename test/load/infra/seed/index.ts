import { CultureContentSeed } from './culture-content';
import { prisma } from './prisma/prisma';
import { UserSeed } from './user';

async function main() {
  await UserSeed.max(100000).generate();
  for (let i = 0; i < 1_000_000; i++) {
    await CultureContentSeed.max(1000).generate();
    console.log('add data');
  }
}

main();
