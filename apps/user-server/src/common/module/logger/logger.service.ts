import { Injectable, Logger, Scope } from '@nestjs/common';
import * as process from 'process';

type Method = (...arg: any[]) => any;

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  private prefix?: string;

  constructor(private readonly logger: Logger) {}

  /**
   * 로그: develop
   */
  public log(methodName: string, message: string): void;
  public log(method: Method, message: string): void;
  public log(methodName: string | Method, message: string) {
    if (process.env.MODE !== 'develop') {
      return;
    }

    if (this.isMethod(methodName)) {
      methodName = methodName.name;
    }

    this.logger.log(`${message}`, `${this.prefix}.${methodName}`);
  }

  /**
   * 경고: product
   */
  public warn(methodName: string, message: string): void;
  public warn(method: Method, message: string): void;
  public warn(methodName: string | Method, message: string): void {
    if (!['product', 'develop'].includes(process.env.MODE || '')) {
      return;
    }

    if (this.isMethod(methodName)) {
      methodName = methodName.name;
    }

    this.logger.warn(`${message}`, `${this.prefix}.${methodName}`);
  }

  /**
   * 에러: product
   */
  public error(methodName: string, message: string): void;
  public error(method: Method, message: string): void;
  public error(methodName: string | Method, message: string, err: any): void;
  public error(methodName: string | Method, message: string, err?: any) {
    if (process.env.MODE !== 'product' && process.env.MODE !== 'develop') {
      return;
    }

    if (this.isMethod(methodName)) {
      methodName = methodName.name;
    }

    this.logger.error(`${message}`, `${this.prefix}.${methodName}`);
    if (err) {
      console.log(err);
    }
  }

  private isMethod(method: string | Method): method is Method {
    return typeof method !== 'string';
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }
}
