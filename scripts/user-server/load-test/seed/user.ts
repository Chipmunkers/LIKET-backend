import { faker } from '@faker-js/faker';
import { prisma } from './prisma/prisma';
import { Prisma } from '@prisma/client';

export class UserSeed {
  private static count: number;
  private static tx: Prisma.TransactionClient = prisma;

  private constructor() {}

  public static transaction(tx: Prisma.TransactionClient) {
    this.tx = tx;

    return this;
  }

  public static max(count: number) {
    this.count = count;

    return this;
  }

  public static async generate(): Promise<void> {
    await this.tx.user.createMany({
      data: Array(this.count)
        .fill(0)
        .map((data, idx) => ({
          email: this.generateRandomEmail(idx),
          pw: faker.internet.password(),
          nickname: faker.person.fullName() + idx.toString(),
          gender: faker.person.sex() === 'female' ? 2 : 1,
        })),
    });

    console.log('Complete to generate User');
  }

  private static generateRandomEmail(idx: number) {
    return (
      faker.person.firstName() +
      idx.toString() +
      '@' +
      faker.internet.domainName()
    );
  }
}
