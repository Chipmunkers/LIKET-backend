export class GetFestivalImgsResponseDto {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items:
        | ''
        | {
            item: {
              contentid: string;
              imgname: string;
              /**
               * 원본 이미지
               */
              originimgurl: string;
              /**
               * 압축된 이미지
               */
              smallimgurl: string;
              cpyrhtDivCd: string;
              serialnum: string;
            }[];
          };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}
