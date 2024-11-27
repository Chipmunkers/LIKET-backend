import { prefixesForLoggers } from './logger.decorator';
import { Provider } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * @author jochongs
 */
function loggerFactory(logger: LoggerService, prefix: string) {
  if (prefix) {
    logger.setPrefix(prefix);
  }
  return logger;
}

/**
 * @author jochongs
 */
function createLoggerProvider(prefix: string): Provider<LoggerService> {
  return {
    provide: `LoggerService${prefix}`,
    useFactory: (logger) => loggerFactory(logger, prefix),
    inject: [LoggerService],
  };
}

/**
 * @author jochongs
 */
export function createLoggerProviders(): Array<Provider<LoggerService>> {
  return prefixesForLoggers.map((prefix) => createLoggerProvider(prefix));
}
