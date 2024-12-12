import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaSetup } from '../setup/prisma.setup';
import { Type } from 'libs/common';
import { PrismaProvider } from 'libs/modules';

interface OverrideBy {
  useValue: (value: any) => ITestHelper;
}

/**
 * 테스트 헬퍼 추상 클래스.
 * 해당 클래스를 각 앱에서 상속하여 사용하기를 기대.
 *
 * @author jochongs
 */
export abstract class ITestHelper {
  protected app: INestApplication;
  protected appModule: TestingModule;
  protected readonly overrideProviderMap: Map<any, any> = new Map();
  protected readonly prismaSetup: PrismaSetup = PrismaSetup.setup();
  private readonly RootModule: Type;

  constructor(AppModule: Type) {
    this.RootModule = AppModule;
  }

  /**
   * 테스트를 시작하는 메서드.
   * beforeEach에서 사용하기를 권장.
   */
  public async init(): Promise<void> {
    await this.prismaSetup.BEGIN();

    const testingModuleBuilder = Test.createTestingModule({
      imports: [this.RootModule],
    });

    for (const mapKey of this.overrideProviderMap.keys()) {
      testingModuleBuilder
        .overrideProvider(mapKey)
        .useValue(this.overrideProviderMap[mapKey]);
    }

    testingModuleBuilder
      .overrideProvider(PrismaProvider)
      .useValue(this.prismaSetup.getPrisma());

    this.appModule = await testingModuleBuilder.compile();
    this.app = this.appModule.createNestApplication();

    await this.appSetup();

    await this.app.init();
  }

  /**
   * appModule과 app 객체의 세팅을 도와주는 메서드.
   *
   * !주의: 외부에서 사용하지 마십시오.
   */
  abstract appSetup(): Promise<void>;

  public async destroy() {
    this.prismaSetup.ROLLBACK();
    await this.appModule.close();
    await this.app.close();
  }

  public getPrisma(): PrismaProvider {
    return this.prismaSetup.getPrisma();
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
