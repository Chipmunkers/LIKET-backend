import { Controller } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerEntity } from './entity/BannerEntity';
import { BannerListPagerbleDto } from './dto/BannerListPagerbleDto';
import { CreateBannerDto } from './dto/CreateBannerDto';
import { UpdateBannerDto } from './dto/UpdateBannerDto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // Admin ====================================================

  /**
   * 관리자용 배너 전체 가져오기
   */
  public getBannerAllForAdmin: (pagerble: BannerListPagerbleDto) => Promise<{
    bannerList: BannerEntity<'all'>[];
    count: number;
  }>;

  /**
   * 배너 자세히보기
   */
  public getBannerByIdxForAdmin: (idx: number) => Promise<BannerEntity<'all'>>;

  /**
   * 배너 생성하기
   */
  public createBanner: (createDto: CreateBannerDto) => Promise<number>;

  /**
   * 배너 수정하기
   */
  public updateBanner: (idx: number) => Promise<void>;

  /**
   * 배너 삭제하기
   */
  public deleteBanner: (
    idx: number,
    updateDto: UpdateBannerDto,
  ) => Promise<void>;

  // User =====================================================

  /**
   * 활성 배너 전체 가져오기
   */
  public getActiveBannerAll: () => Promise<BannerEntity<'active'>[]>;
}
