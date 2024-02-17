import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class LiketService {
  constructor(private readonly prisma: PrismaService) {}
}
