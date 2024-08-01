import { faker } from '@faker-js/faker';
import { prisma } from './prisma/prisma';
import { Prisma } from '@prisma/client';

export class CultureContentSeed {
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

  public static async generate() {
    await Promise.all(
      Array(this.count)
        .fill(0)
        .map(async () => {
          const bCode =
            faker.helpers.arrayElement([
              '11',
              '26',
              '27',
              '28',
              '29',
              '30',
              '31',
              '36',
              '41',
              '43',
              '44',
              '46',
              '47',
              '48',
              '50',
              '51',
              '52',
            ]) + faker.number.int({ min: 10000000, max: 99999999 });

          const location = await this.tx.location.create({
            data: {
              address: faker.lorem.words(1),
              detailAddress: faker.lorem.words(2),
              region1Depth: faker.lorem.words(3),
              region2Depth: faker.lorem.words(3),
              bCode,
              hCode: bCode,
              sidoCode: bCode.substring(0, 2),
              sggCode: bCode.substring(2, 5),
              legCode: bCode.substring(5, 8),
              riCode: bCode.substring(8, 10),
              positionX: faker.number.float(),
              positionY: faker.number.float(),
            },
          });

          const content = await this.tx.cultureContent.create({
            data: {
              genreIdx: faker.number.int({ min: 1, max: 5 }),
              userIdx: faker.number.int({ min: 1, max: 100 }),
              ageIdx: faker.number.int({ min: 1, max: 6 }),
              title: faker.lorem.slug({ min: 1, max: 20 }),
              locationIdx: location.idx,
              Style: {
                createMany: {
                  data: this.generateRandomStyleIdx(
                    faker.number.int({ min: 1, max: 3 }),
                  ).map((styleIdx) => ({
                    styleIdx,
                  })),
                },
              },
              description: faker.lorem.lines({ min: 1, max: 10 }),
              websiteLink: faker.internet.url(),
              startDate: faker.date.between({
                from: '2020-01-01',
                to: '2025-01-01',
              }),
              endDate: faker.date.between({
                from: '2020-01-01',
                to: '2025-01-01',
              }),
              openTime: faker.lorem.lines(1),
              isFee: faker.number.int({ min: 1, max: 2 }) === 1,
              isReservation: faker.number.int({ min: 1, max: 2 }) === 1,
              isPet: faker.number.int({ min: 1, max: 2 }) === 1,
              isParking: faker.number.int({ min: 1, max: 2 }) === 1,
            },
          });

          console.log(content.idx);
        }),
    );

    console.log('Complete to generate Culture Content');
  }

  private static generateRandomStyleIdx(size: number) {
    const randomArray: number[] = [];

    const min = 1;
    const max = 10;

    while (true) {
      const randomNumber = faker.number.int({ min, max });

      if (randomArray.includes(randomNumber)) continue;

      randomArray.push(randomNumber);

      if (randomArray.length === size) break;
    }

    return randomArray;
  }
}
