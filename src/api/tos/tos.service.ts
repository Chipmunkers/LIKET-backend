import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTosDto } from './dto/CreateTosDto';
import { UpdateTosDto } from './dto/UpdateTosDto';
import { TosEntity } from './entity/TosEntity';

@Injectable()
export class TosService {
  constructor(private readonly prisma: PrismaService) {}

  public getTosAll: () => Promise<TosEntity<'summary', 'user'>>;

  public getTosByIdx: () => Promise<TosEntity<'detail', 'user'>>;

  // Admin

  public getTosAdminAll: () => Promise<TosEntity<'summary', 'admin'>[]>;

  public getTosAmdminByIdx: (
    idx: number,
  ) => Promise<TosEntity<'detail', 'admin'>>;

  public createTos: (createDto: CreateTosDto) => Promise<void>;

  public updateTos: (idx: number, updateDto: UpdateTosDto) => Promise<void>;

  public deleteTos: (idx: number) => Promise<void>;
}
