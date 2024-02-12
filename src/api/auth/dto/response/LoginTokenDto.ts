export class LoginTokenDto {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  static setToken(token: string) {
    return new LoginTokenDto(token);
  }
}
