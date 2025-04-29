# core 디렉토리

도메인 로직을 관리하는 코드 파일을 관리합니다.

## Core 모듈 사용 규칙

RootModule에 반드시 ClsModule을 import 해야합니다.

```ts
ClsModule.forRoot({
  plugins: [
    new ClsPluginTransactional({
      imports: [PrismaModule],
      adapter: new TransactionalAdapterPrisma({
        prismaInjectionToken: PrismaProvider,
      }),
    }),
  ],
});
```
