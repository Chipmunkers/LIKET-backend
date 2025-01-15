export class KopisErrorResponseDto {
  dbs: null | {
    db: {
      returncode: string;
      errmsg: string;
      responsesettime: string;
    };
  };
}
