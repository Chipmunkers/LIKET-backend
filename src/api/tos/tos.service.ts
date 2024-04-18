import { Injectable } from '@nestjs/common';
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
  public getTosAll: () => Promise<TosEntity<'summary', 'user'>>;

  /**
   * Get a detail TOS
   */
  public getTosByIdx: () => Promise<TosEntity<'detail', 'user'>>;

  // Admin

  /**
   * Get all TOS for admin
   */
  public getTosAllForAdmin: () => Promise<TosEntity<'summary', 'admin'>[]>;

  /**
   * Get a detail TOS for admin
   */
  public getTosByIdxForAdmin: (
    idx: number,
  ) => Promise<TosEntity<'detail', 'admin'>>;

  /**
   * Create a TOS
   */
  public createTos: (createDto: CreateTosDto) => Promise<void>;

  /**
   * Update a Tos by idx
   */
  public updateTos: (idx: number, updateDto: UpdateTosDto) => Promise<void>;

  /**
   * Delete a TOS by idx
   */
  public deleteTos: (idx: number) => Promise<void>;
}
