/**
 * @author jochongs
 */
class NaverUserInfo {
  public id: string;
  public nickname: string;
  public gender: 'F' | 'M' | 'U';
  public email: string;
  public birthyead: string;
}

/**
 * @author jochongs
 */
export class GetNaverUserResponseDto {
  public resultcode: string;
  public message: string;
  public response: NaverUserInfo;
}
