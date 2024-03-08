import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  private prefix?: string;

  log(methodName: string, message: string) {
    console.log(
      `[${new Date().toUTCString()}] ${this.prefix}.${methodName}: ${message}`,
    );
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }
}
