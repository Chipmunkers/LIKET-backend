import { DynamicModule, Global, Module } from '@nestjs/common';
import { createLoggerProviders } from './logger.provider';
import { LoggerService } from './logger.service';

@Global()
export class LoggerModule {
  static forRoot(): DynamicModule {
    const prefixedLoggerProviders = createLoggerProviders();
    return {
      module: LoggerModule,
      providers: [LoggerService, ...prefixedLoggerProviders],
      exports: [LoggerService, ...prefixedLoggerProviders],
    };
  }
}
