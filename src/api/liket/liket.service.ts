import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LiketService {
  constructor(private readonly prisma: PrismaService) {}
}
