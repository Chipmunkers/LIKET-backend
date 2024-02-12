import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TosDto } from './dto/response/TosDto';
import { AdminTosDto } from './dto/response/AdminTosDto';
import { CreateTosDto } from './dto/request/CreateTosDto';
import { UpdateTosDto } from './dto/request/UpdateTosDto';

@Injectable()
export class TosService {
  constructor(private readonly prisma: PrismaService) {}

  public getTosAll: () => Promise<TosDto[]>;

  public getTosByIdx: () => Promise<TosDto<{ contents: string }>>;

  // Admin

  public getTosAdminAll: () => Promise<AdminTosDto[]>;

  public getTosAmdminByIdx: (
    idx: number,
  ) => Promise<AdminTosDto<{ contents: string }>>;

  public createTos: (createDto: CreateTosDto) => Promise<void>;

  public updateTos: (idx: number, updateDto: UpdateTosDto) => Promise<void>;

  public deleteTos: (idx: number) => Promise<void>;
}
