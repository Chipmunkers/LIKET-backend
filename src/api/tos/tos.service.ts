import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTosDto } from './dto/CreateTosDto';
import { UpdateTosDto } from './dto/UpdateTosDto';
import { TosEntity } from './entity/TosEntity';

@Injectable()
export class TosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all TOS
   */
  public getTosAll: () => Promise<TosEntity<'summary', 'user'>[]> =
    async () => {
      const tosList = await this.prisma.tos.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          idx: 'asc',
        },
      });

      return tosList.map((tos) => TosEntity.createUserSummaryTos(tos));
    };

  /**
   * Get a detail TOS
   */
  public getTosByIdx: (idx: number) => Promise<TosEntity<'detail', 'user'>> =
    async (idx) => {
      const tos = await this.prisma.tos.findUnique({
        where: {
          idx,
          deletedAt: null,
        },
      });

      if (!tos) {
        throw new NotFoundException('Cannot find Terms Of Service');
      }

      return TosEntity.createUserDetailTos(tos);
    };

  // Admin

  /**
   * Get all TOS for admin
   */
  public getTosAllForAdmin: () => Promise<TosEntity<'summary', 'admin'>[]> =
    async () => {
      const tosList = await this.prisma.tos.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          idx: 'desc',
        },
      });

      return tosList.map((tos) => TosEntity.createAdminSummaryTos(tos));
    };

  /**
   * Get a detail TOS for admin
   */
  public getTosByIdxForAdmin: (
    idx: number,
  ) => Promise<TosEntity<'detail', 'admin'>> = async (idx) => {
    const tos = await this.prisma.tos.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!tos) {
      throw new NotFoundException('Cannot find Terms of Service');
    }

    return TosEntity.createAdminDetailTos(tos);
  };

  /**
   * Create a TOS
   */
  public createTos: (createDto: CreateTosDto) => Promise<void> = async (
    createDto,
  ) => {
    await this.prisma.tos.create({
      data: {
        title: createDto.title,
        contents: createDto.contents,
        isEssential: createDto.isEssential,
      },
    });

    return;
  };

  /**
   * Update a Tos by idx
   */
  public updateTos: (idx: number, updateDto: UpdateTosDto) => Promise<void> =
    async (idx, updateDto) => {
      await this.prisma.tos.update({
        where: {
          idx,
        },
        data: {
          title: updateDto.title,
          contents: updateDto.contents,
          isEssential: updateDto.isEssential,
        },
      });

      return;
    };

  /**
   * Delete a TOS by idx
   */
  public deleteTos: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.tos.update({
      where: {
        idx,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  };
}
