export class GetKakaoTokenResponseDto {
  public token_type: string;
  public access_token: string;
  public id_token: string;
  public expires_in: number;
  public refresh_token: string;
  public refresh_token_expires_in: number;
  public scope: string;
}
