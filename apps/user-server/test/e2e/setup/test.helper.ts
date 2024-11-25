import { INestApplication, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaSetting } from './prisma.setup';
import { AppModule } from '../../../src/app.module';
import { AppGlobalSetting } from './app-global.setup';
import { LoginSetting, TestLoginUsers } from './login-user.setup';

interface OverrideBy {
  useValue: (value: any) => TestHelper;
}

/**
 * E2E 테스트를 도와주는 클래스입니다.
 *
 * @author jochongs
 */
export class TestHelper {
  private app: INestApplication;
  private appModule: TestingModule;
  private loginUsers: TestLoginUsers;
  private readonly overrideProviderMap: Map<any, any> = new Map();
  private readonly prismaSetting: PrismaSetting;

  private constructor() {
    this.prismaSetting = PrismaSetting.setup();
  }

  public static create() {
    return new TestHelper();
  }

  public async init() {
    await this.prismaSetting.BEGIN();

    const testingModuleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });

    for (const mapKey of this.overrideProviderMap.keys()) {
      testingModuleBuilder
        .overrideProvider(mapKey)
        .useValue(this.overrideProviderMap[mapKey]);
    }

    this.appModule = await testingModuleBuilder.compile();
    this.app = this.appModule.createNestApplication();
    this.loginUsers = await LoginSetting.init(this.app);

    AppGlobalSetting.setup(this.app);

    await this.app.init();
  }

  public getLoginUsers() {
    return this.loginUsers;
  }

  public async destroy() {
    this.prismaSetting.ROLLBACK();
    await this.appModule.close();
    await this.app.close();
  }

  public get<T = any>(typeOrToken: Type<T>) {
    return this.app.get(typeOrToken);
  }

  public overrideProvider<T = any>(provider: T): OverrideBy {
    const addProvider = (value: any) => {
      this.addProviderToMap(provider, value);
      return this;
    };

    return {
      useValue: (value) => addProvider(value),
    };
  }

  public getServer() {
    return this.app.getHttpServer();
  }

  private addProviderToMap(key: any, value: any) {
    this.overrideProvider[key] = value;
  }
}
