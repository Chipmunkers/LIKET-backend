import { Injectable } from '@nestjs/common';
import { Prisma } from '../../common/prisma/prisma.service';

@Injectable()
export class LiketService {
  constructor(private readonly prisma: Prisma) {}
}
