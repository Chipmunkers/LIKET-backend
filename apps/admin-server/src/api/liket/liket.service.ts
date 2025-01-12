import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class LiketService {
  constructor(private readonly prisma: PrismaProvider) {}
}
