import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class CultureContentRepository {
  constructor(private readonly prisma: PrismaProvider) {}
}
