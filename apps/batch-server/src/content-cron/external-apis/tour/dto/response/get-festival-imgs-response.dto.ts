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
              originimgurl: string;
              smallimageurl: string;
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
