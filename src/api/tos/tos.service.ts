import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TosService {
  constructor(private readonly prisma: PrismaService) {}
}
