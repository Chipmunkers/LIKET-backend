class KakaoAccount {
  public email: string;
  public profile: {
    nickname: string;
  };
  public gender?: string;
}

export class GetKakaoUserResponseDto {
  public id: number;
  public connected_at: string;
  public properties: Object;
  public kakao_account: KakaoAccount;
}
