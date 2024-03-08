import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  private prefix?: string;

  log(message: string) {
    console.log(`[${new Date().toUTCString()}] ${this.prefix}: ${message}`);
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }
}
