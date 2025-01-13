import { Injectable, Logger } from '@nestjs/common';
import { SummaryPerformEntity } from '../content-cron/external-apis/kopis/entity/summary-perform.entity';
import { KopisPerformProvider } from '../content-cron/external-apis/kopis/provider/kopis-perform.provider';
import { KopisFacilityProvider } from '../content-cron/external-apis/kopis/provider/kopis.facility.provider';
import { RawTempContentEntity } from './entity/raw-temp-content.entity';
import { KakaoAddressService } from '../../../../libs/modules/src/kakao-address/kakao-address.service';
import { GetRawContentException } from './exception/GetRawContentException';
import { TempContentPipeService } from './temp-content-pipe.service';
import { TempContentRepository } from './temp-content.repository';
import { TempContentEntity } from './entity/temp-content.entity';

@Injectable()
export class TempContentService {
  private readonly MODE: 'develop' | 'product' | 'test';

  // constructor(
  //   private readonly logger: Logger,
  //   private readonly kopisPerformService: KopisPerformProvider,
  //   private readonly kopisFacilityService: KopisFacilityProvider,
  //   private readonly kakaoAddressService: KakaoAddressService,
  //   private readonly tempContentPipeService: TempContentPipeService,
  //   private readonly tempContentRepository: TempContentRepository,
  // ) {
  //   this.MODE =
  //     process.env.MODE === 'develop'
  //       ? 'develop'
  //       : process.env.MODE === 'product'
  //       ? 'product'
  //       : 'test';
  // }

  // /**
  //  * 어제 이후로 업데이트 된 공연 목록보기
  //  * !주의: 공연과 시설 모두 가져옵니다.
  //  *
  //  * 해당 메서드는 API key 사용 횟수가 빠르게 소모됩니다.
  //  * 하루에 한 번 사용하도록 주의하십시오.
  //  *
  //  * ! 프로덕션에서 Promise.all을 감당하지 못하여 Deprecated 되었습니다.
  //  * ! 사용하지 마십시오.
  //  *
  //  * @author jochongs
  //  *
  //  * @deprecated
  //  */
  // public async getDetailPerformAllUpdatedAfterYesterday(): Promise<
  //   RawTempContentEntity[]
  // > {
  //   const summaryPerformList =
  //     await this.getSummaryPerformAllUpdatedAfterToday();

  //   this.logger.log(`Perform Count: ${summaryPerformList.length}`);

  //   const settledList = await Promise.allSettled(
  //     summaryPerformList.map((summaryPerform) =>
  //       this.getRawTempContentEntityByPerformId(summaryPerform.mt20id),
  //     ),
  //   );

  //   // TODO: 재시도 로직으로 변경해야함
  //   settledList
  //     .filter(
  //       (data): data is PromiseRejectedResult => data.status === 'rejected',
  //     )
  //     .forEach((data) => {
  //       this.logger.error(
  //         `FAIL to get raw content | id = ${data.reason.id || 'Unknown'}`,
  //       );
  //       console.log(data.reason);
  //     });

  //   return settledList
  //     .filter(
  //       (data): data is PromiseFulfilledResult<RawTempContentEntity> =>
  //         data.status === 'fulfilled',
  //     )
  //     .map((data) => data.value);
  // }

  // /**
  //  * 공연예술 가져와 저장하기
  //  * 시간이 오래걸릴 수 있습니다.
  //  * CRON에서 호출하기를 기대합니다.
  //  *
  //  * @author jochongs
  //  */
  // public async saveAllPerformFromKopisAPI(): Promise<void> {
  //   const summaryPerformList =
  //     await this.getSummaryPerformAllUpdatedAfterToday();

  //   for (const i in summaryPerformList) {
  //     this.logger.log(
  //       `Saving Perform ${Number(i) + 1}/${summaryPerformList.length}`,
  //       'kopis-cron',
  //     );
  //     const summaryPerform = summaryPerformList[i];

  //     try {
  //       const rawTempContent = await this.getRawTempContentEntityByPerformId(
  //         summaryPerform.mt20id,
  //       );

  //       const tempContent =
  //         await this.tempContentPipeService.createTempContentEntity(
  //           rawTempContent,
  //         );

  //       await this.upsertTempContent(tempContent);

  //       if (this.MODE === 'develop') {
  //         await this.upsertContentForDevelop(tempContent);
  //       }
  //     } catch (err) {
  //       this.logger.error(
  //         `Fail to save perform | id = ${summaryPerform.mt20id}`,
  //         'kopis-cron',
  //       );
  //       console.log(err);
  //     }
  //   }
  // }

  // /**
  //  * @author jochongs
  //  */
  // private async upsertTempContent(
  //   tempContent: TempContentEntity,
  // ): Promise<void> {
  //   const alreadyExistTempContentInDB =
  //     await this.tempContentRepository.selectTempContentById(tempContent.id);

  //   if (alreadyExistTempContentInDB) {
  //     await this.tempContentRepository.updateTempContentByIdx(
  //       alreadyExistTempContentInDB.idx,
  //       alreadyExistTempContentInDB.locationIdx,
  //       tempContent,
  //     );
  //     this.logger.debug(
  //       'Success update perform | id = ' + tempContent.id,
  //       'kopis-cron',
  //     );
  //   } else {
  //     await this.tempContentRepository.insertTempContent(tempContent);
  //     this.logger.debug(
  //       'Success saving perform | id = ' + tempContent.id,
  //       'kopis-cron',
  //     );
  //   }
  // }

  // /**
  //  * @author jochongs
  //  */
  // private async upsertContentForDevelop(
  //   tempContent: TempContentEntity,
  // ): Promise<void> {
  //   if (this.MODE !== 'develop') return;

  //   const alreadyExistCultureContent =
  //     await this.tempContentRepository.selectContentByPerformId(tempContent.id);

  //   if (alreadyExistCultureContent) {
  //     return;
  //   }

  //   await this.tempContentRepository.insertContentByTempContentEntityForDevelop(
  //     tempContent,
  //   );
  // }

  // /**
  //  * RawTempContentEntity 생성하기
  //  *
  //  * KOPIS 서비스 키 최대 2번을 사용할 수 있는 메서드입니다.
  //  *
  //  * @author jochongs
  //  */
  // public async getRawTempContentEntityByPerformId(
  //   id: string,
  // ): Promise<RawTempContentEntity> {
  //   try {
  //     const perform = await this.kopisPerformService.getPerformById(id);

  //     const facility = await this.kopisFacilityService.getFacilityByPerform(
  //       perform,
  //     );

  //     const addressData = await this.kakaoAddressService.searchAddress(
  //       facility.adres,
  //     );
  //     const address = addressData.documents[0].address;
  //     const roadAddress = addressData.documents[0].road_address;

  //     return {
  //       perform,
  //       facility,
  //       address,
  //       roadAddress,
  //     };
  //   } catch (err: any) {
  //     throw new GetRawContentException(id, err);
  //   }
  // }

  // /**
  //  * 오늘 업데이트된 데이터 전부 가져오기 (요약으로 가져옴)
  //  *
  //  * @author jochongs
  //  */
  // public async getSummaryPerformAllUpdatedAfterToday(): Promise<
  //   SummaryPerformEntity[]
  // > {
  //   let page = 1;

  //   const summaryPerformList: SummaryPerformEntity[] = [];

  //   const yesterday = this.getYesterday();

  //   this.logger.log(
  //     `Search Updated Performs after: ${yesterday}`,
  //     'kopis-cron',
  //   );

  //   while (true) {
  //     const performs = await this.kopisPerformService.getPerformAll({
  //       rows: 100,
  //       cpage: page,
  //       afterdate: yesterday,
  //     });

  //     const performIdList = summaryPerformList.map((perform) => perform.mt20id);

  //     performs.forEach((perform) => {
  //       if (performIdList.includes(perform.mt20id)) return;

  //       summaryPerformList.push(perform);
  //     });

  //     if (performs.length < 100) {
  //       break;
  //     }

  //     page++;
  //   }

  //   return summaryPerformList;
  // }

  // /**
  //  * 오늘 날짜 데이터를 포맷화해서 가져오기
  //  *
  //  * @returns 20241204
  //  */
  // private getYesterday() {
  //   const date = new Date();

  //   date.setHours(date.getHours() - 24);

  //   return `${date.getFullYear().toString()}${(date.getMonth() + 1)
  //     .toString()
  //     .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  // }
}
