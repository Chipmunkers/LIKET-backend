import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LiketEntity } from './entity/LiketEntity';
import { CreateLiketDto } from './dto/CreateLiketDto';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { AlreadyExistLiketException } from './exception/AlreadyExistLiketException';
import { UploadService } from '../upload/upload.service';
import { FILE_GROUPING } from '../upload/file-grouping';
import { LiketNotFoundException } from './exception/LiketNotFoundException';

@Injectable()
export class LiketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Create LIKET
   */
  createLiket: (
    reviewIdx: number,
    loginUser: LoginUserDto,
    createDto: CreateLiketDto,
  ) => Promise<LiketEntity<'detail'>> = async (
    reviewIdx,
    loginUser,
    createDto,
  ) => {
    await this.uploadService.checkExistFile(
      createDto.img.filePath,
      FILE_GROUPING.LIKET,
    );

    const createdLiket = await this.prisma.$transaction(
      async (tx) => {
        const liket = await tx.liket.findFirst({
          where: {
            userIdx: loginUser.idx,
            reviewIdx,
            deletedAt: null,
          },
        });

        if (liket) {
          throw new AlreadyExistLiketException('Already exist LIKET');
        }

        return await tx.liket.create({
          include: {
            Review: {
              include: {
                CultureContent: {
                  include: {
                    Genre: true,
                    Location: true,
                    ContentImg: true,
                  },
                },
                ReviewImg: true,
              },
            },
            User: true,
          },
          data: {
            imgPath: createDto.img.filePath,
            description: createDto.description,
            reviewIdx,
            userIdx: loginUser.idx,
          },
        });
      },
      {
        isolationLevel: 'Serializable',
      },
    );

    return LiketEntity.createDetailLiket(createdLiket);
  };

  /**
   * Get liket by idx
   */
  getLiketByIdx: (idx: number) => Promise<LiketEntity<'detail'>> = async (
    idx,
  ) => {
    const liket = await this.prisma.liket.findUnique({
      include: {
        Review: {
          include: {
            CultureContent: {
              include: {
                Genre: true,
                Location: true,
                ContentImg: true,
              },
            },
            ReviewImg: true,
          },
        },
        User: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!liket) {
      throw new LiketNotFoundException('Cannot find LIKET');
    }

    return LiketEntity.createDetailLiket(liket);
  };
}
